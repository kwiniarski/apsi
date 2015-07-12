/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var sinon = require('sinon');
var winston = require('winston');
var requestMock = require('../../mocks/express-request');
var responseMock = require('../../mocks/express-response');
var nextMock = require('../../mocks/express-next');
var fakes = [];
var log = null;
var onFinishedStub = sinon.stub().callsArg(1);

describe.skip('Access log provider', function () {
  beforeEach(function () {
    var object, transport, _ref;
    mockery.registerMock('on-finished', onFinishedStub);
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    _ref = winston.transports;
    for (transport in _ref) {
      object = _ref[transport];
      fakes[transport] = sinon.stub(object.prototype, 'log').returns();
    }
    log = require('../../../lib/log/access');
  });
  afterEach(function () {
    var fake, object;
    for (fake in fakes) {
      object = fakes[fake];
      object.restore();
    }
    mockery.disable();
  });
  it('should log request data', function () {
    var req, res;
    req = requestMock('POST', '/index/add');
    res = responseMock(200);
    log(req, res, nextMock);
    expect(nextMock).to.have.been.called;
    expect(fakes.Console).to.have.been.calledOnce;
  });
});

