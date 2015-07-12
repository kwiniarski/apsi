/* globals expect, mockery */
/* jshint -W030 */

'use strict';

mockery.enable({
  warnOnUnregistered: false,
  useCleanCache: true
});

var sinon = require('sinon');
var support = require('../../../../lib/support');
var PolicyRegistry = require('../../../../lib/policy/registry');
var PolicyManager = require('../../../../lib/policy/manager');
var PolicyConfig = require('../../../../lib/policy/config');
var base = '/home/project';
var file = {
  file: '/home/project/lib/file.js',
  path: 'lib/file',
  name: 'libFile'
};

describe('PolicyRegistry', function () {
  beforeEach(function () {
    sinon.stub(support, 'loadModules').withArgs(base).returns([file]);
    sinon.stub(support, 'require').returns(file);
  });
  afterEach(function () {
    support.require.restore();
    support.loadModules.restore();
  });
  it('should load all policies from specified dir', function () {
    sinon.mock(PolicyRegistry.prototype).expects('set').withExactArgs(file.name, file.file);
    new PolicyRegistry({
      dir: base
    });
    PolicyRegistry.prototype.set.restore();
  });
  describe('method to get policy', function () {
    var config, pm;
    pm = null;
    config = null;
    beforeEach(function () {
      config = {
        dir: base,
        blockMiddleware: function (req, res, next) {
          return next(true);
        },
        allowMiddleware: function (req, res, next) {
          return next();
        }
      };
      pm = new PolicyRegistry(config);
    });
    it('should return policy by name', function () {
      expect(pm.get('libFile')).to.be.equal(file);
    });
    it('should return allow method when name is set to allow flag', function () {
      expect(pm.get(true)).to.be.equal(config.allowMiddleware);
    });
    it('should return block method when name is set to block flag', function () {
      expect(pm.get(false)).to.be.equal(config.blockMiddleware);
    });
    it('should throw error when requested policy is not found', function () {
      expect(function () {
        pm.get('unknown');
      }).to.throw(ReferenceError);
    });
    it('should return an error when trying to get not configured block/allow middleware', function () {
      pm = new PolicyRegistry({
        dir: base
      });
      expect(function () {
        pm.get(true);
      }).to.throw(Error);
      expect(function () {
        pm.get(false);
      }).to.throw(Error);
    });
  });
});

describe('PolicyManager', function () {
  var aPolicy, allowPolicy, bPolicy, blockPolicy, config, list, pc, pm, pr;
  base = '/home/policies';
  list = [
    {
      file: '/home/policies/a-policy.js',
      path: 'a-policy',
      name: 'aPolicy'
    }, {
      file: '/home/policies/b-policy.js',
      path: 'b-policy',
      name: 'bPolicy'
    }
  ];
  aPolicy = sinon.spy();
  bPolicy = sinon.spy();
  allowPolicy = sinon.spy();
  blockPolicy = sinon.spy();
  pr = null;
  pm = null;
  pc = null;
  config = {
    '*': ['aPolicy'],
    'a-resource': {
      '*': [true],
      'a-action': ['bPolicy']
    },
    'b-resource': {
      '*': [false],
      'b-action': ['aPolicy', 'bPolicy']
    },
    'c-resource': {
      '*': ['aPolicy']
    },
    'd-resource': ['aPolicy']
  };
  beforeEach(function () {
    sinon.stub(support, 'loadModules').withArgs(base).returns(list);
    sinon.stub(support, 'require');
    support.require.withArgs('/home/policies/a-policy.js').returns(aPolicy);
    support.require.withArgs('/home/policies/b-policy.js').returns(bPolicy);
    pr = new PolicyRegistry({
      dir: base,
      allowMiddleware: allowPolicy,
      blockMiddleware: blockPolicy
    });
    pc = new PolicyConfig(config);
    pm = new PolicyManager(pr, pc);
  });
  afterEach(function () {
    support.require.restore();
    support.loadModules.restore();
    aPolicy.reset();
    bPolicy.reset();
    allowPolicy.reset();
    blockPolicy.reset();
  });
  it('should provide all policies for specified resource', function () {
    expect(pm.get('c-resource')).to.deep.equal([aPolicy]);
    expect(pm.get('d-resource')).to.deep.equal([aPolicy]);
  });
  it('should provide all policies for specified resource action', function () {
    expect(pm.get('b-resource', 'b-action')).to.deep.equal([aPolicy, bPolicy]);
  });
  it('should return configured allow function if resource was configured with allow flag', function () {
    expect(pm.get('a-resource')).to.deep.equal([allowPolicy]);
    expect(pm.get('a-resource', 'z-action')).to.deep.equal([allowPolicy]);
  });
  it('should return configured block function if resource was configured with block flag', function () {
    expect(pm.get('b-resource')).to.deep.equal([blockPolicy]);
  });
  it('should provide resource policies when asked for action which is not configured', function () {
    expect(pm.get('c-resource', 'z-action')).to.deep.equal([aPolicy]);
  });
  it('should provide global policies when asked for resource which is not configured', function () {
    expect(pm.get()).to.deep.equal([aPolicy]);
    expect(pm.get('z-resource')).to.deep.equal([aPolicy]);
    expect(pm.get('z-resource', 'z-action')).to.deep.equal([aPolicy]);
  });
});

describe('PolicyConfig', function () {
  var baseA, baseB, configA, configB, pc;
  pc = null;
  baseA = '/home/config/policies.js';
  configA = {
    a: true,
    b: 'aPolicy',
    c: 'a-policy, b-policy',
    d: ['a-policy, b-policy', 'c-policy'],
    e: {
      a: true
    }
  };
  baseB = '/home/config/policies-error.js';
  configB = {
    a: ['aPolicy', true]
  };
  beforeEach(function () {
    sinon.stub(support, 'require');
    support.require.withArgs(baseA).returns(configA);
    support.require.withArgs(baseB).returns(configB);
    pc = new PolicyConfig(baseA);
  });
  afterEach(function () {
    support.require.restore();
  });
  it('should load configuration file', function () {
    expect(support.require).to.be.calledWith(baseA);
  });
  it('should convert boolen and string values to arrays', function () {
    expect(pc.a).to.be.deep.equal([true]);
    expect(pc.b).to.be.deep.equal(['aPolicy']);
  });
  it('should convert strings to arrays if they contain coma sign', function () {
    expect(pc.c).to.be.deep.equal(['aPolicy', 'bPolicy']);
  });
  it('should flatten values which may be arrays', function () {
    expect(pc.d).to.be.deep.equal(['aPolicy', 'bPolicy', 'cPolicy']);
  });
  it('should throw an error when block/allow policy is used together with custom policies', function () {
    expect(function () {
      new PolicyConfig(baseB);
    }).to.throw(Error);
  });
  it('should parse values for actions', function () {
    expect(pc.e.a).to.be.deep.equal([true]);
  });
});
