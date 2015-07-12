/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var sinon = require('sinon');
var Resource = require('../../../../lib/resource/index');
var ResourceAction = require('../../../../lib/resource/action');
var ResourceGenericActions = require('../../../../lib/resource/action-blueprint');
var actionWrapper = require('../../../../lib/resource/action-wrapper');

describe('Resource', function () {
  var modelStub = null;
  var controllerStub = null;
  var p1 = sinon.spy();
  var p2 = sinon.spy();

  beforeEach(function () {
    var controllerAction, findAction;
    p1.reset();
    p2.reset();
    modelStub = sinon.stub({
      someResource: {
        path: 'some/resource'
      },
      anotherResource: {
        path: 'another/resource'
      }
    });
    findAction = actionWrapper(sinon.spy());
    findAction.id = 'find';
    controllerAction = actionWrapper(sinon.spy());
    controllerAction.id = 'controllerAction';
    controllerStub = sinon.stub({
      someResource: {
        name: 'someResource',
        path: 'some/resource',
        actions: {
          find: findAction,
          controllerAction: controllerAction
        }
      }
    });
  });
  it('should throw error when passed model and controller do not match the same path', function () {
    expect(function () {
      return new Resource(modelStub.anotherResource, controllerStub.someResource);
    }).to.throw('Mount path for model ("another/resource") and controller ("some/resource") do not match');
  });
  it('should throw error when mount path was not set properly', function () {
    expect(function () {
      return new Resource();
    }).to.throw('Cannot initialize resource without mount path');
  });
  it('should return actions returned by controller', function () {
    var rm;
    rm = new Resource(modelStub.someResource, controllerStub.someResource);
    expect(rm.getAction('controllerAction')).to.be.instanceof(ResourceAction);
  });
  it('should return generic actions created for model model', function () {
    var rm;
    rm = new Resource(modelStub.someResource);
    expect(rm.getAction('find')).to.be.instanceof(ResourceAction);
  });
  it('should return controller actions before model actions if both are defined', function () {
    var rm;
    rm = new Resource(modelStub.someResource, controllerStub.someResource);
    expect(rm.getAction('find').handler).to.equal(controllerStub.someResource.actions.find);
  });
  it('should call policies in FIFO order', function () {
    var handle, policies, rm, _i, _len, _ref;
    policies = sinon.stub({
      get: function () {}
    });
    policies.get.withArgs('someResource').returns([p1, p2]);
    rm = new Resource(null, controllerStub.someResource, policies);
    _ref = rm.policies;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      handle = _ref[_i];
      handle();
    }
    expect(p1).to.be.calledOnce.and.to.be.calledBefore(p2);
    expect(p2).to.be.calledOnce;
  });
  it('should add policies to the action if it is specified', function () {
    var policies, rm;
    policies = sinon.stub({
      get: function () {}
    });
    policies.get.withArgs('someResource', 'find').returns([p1]);
    rm = new Resource(null, controllerStub.someResource, policies);
    expect(rm.policies).to.be.empty;
    expect(rm.getAction('find').policies).to.have.length(1);
  });
});
