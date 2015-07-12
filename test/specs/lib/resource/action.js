/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var sinon = require('sinon');
var ResourceAction = require('../../../../lib/resource/action');
var actionWrapper = require('../../../../lib/resource/action-wrapper');

describe('ResourceAction', function () {
  beforeEach(function () {
    this.handler = sinon.spy();
    this.handler.id = 'actionName';
    this.action = new ResourceAction(this.handler);
  });
  it('should throw error when handler is not a function', function () {
    expect(function () {
      return new ResourceAction();
    }).to.throw;
  });
  it('should throw error when handler has no id', function () {
    var handler;
    handler = sinon.spy();
    expect(function () {
      return new ResourceAction(handler);
    }).to.throw;
  });
  it('should set mountPath using id, when mountPath is not given', function () {
    expect(this.action.mountPath).to.equal('/action-name');
  });
  it('should have default value for policies', function () {
    expect(this.action.policies).to.eql([]);
  });
  it('should have default value for methods', function () {
    expect(this.action.methods).to.eql(['GET']);
  });
  it('should provide method to add more policies', function () {
    this.action.registerPolicies(sinon.spy());
    expect(this.action.policies).to.have.length(1);
  });
});

