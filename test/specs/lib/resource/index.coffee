'use strict'

sinon = require 'sinon'
#express = require 'express'
Resource = require '../../../../lib/resource/index'
ResourceAction = require '../../../../lib/resource/action'
ResourceGenericActions = require '../../../../lib/resource/action-blueprint'
#ResourceGenericActionsStub = null
actionWrapper = require '../../../../lib/resource/action-wrapper'

describe 'Resource', ->

  modelStub = null
  controllerStub = null

  p1 = sinon.spy()
  p2 = sinon.spy()

  beforeEach ->
    p1.reset()
    p2.reset()

    modelStub = sinon.stub
      someResource:
        path: 'some/resource'
      anotherResource:
        path: 'another/resource'

    findAction = actionWrapper sinon.spy()
    findAction.id = 'find'

    controllerAction = actionWrapper sinon.spy()
    controllerAction.id = 'controllerAction'

    controllerStub = sinon.stub
      someResource:
        name: 'someResource'
        path: 'some/resource'
        actions:
          find: findAction
          controllerAction: controllerAction


  it 'should throw error when passed model and controller do not match the same path', ->
    expect -> new Resource modelStub.anotherResource, controllerStub.someResource
      .to.throw 'Mount path for model ("another/resource") and controller ("some/resource") do not match'

  it 'should throw error when mount path was not set properly', ->
    expect -> new Resource()
      .to.throw 'Cannot initialize resource without mount path'

  it 'should return actions returned by controller', ->
    rm = new Resource modelStub.someResource, controllerStub.someResource
    expect(rm.getAction 'controllerAction').to.be.instanceof(ResourceAction)

  it 'should return generic actions created for model model', ->
    rm = new Resource modelStub.someResource
    expect(rm.getAction 'find').to.be.instanceof(ResourceAction)

  it 'should return controller actions before model actions if both are defined', ->
    rm = new Resource modelStub.someResource, controllerStub.someResource
    expect(rm.getAction('find').handler).to.equal(controllerStub.someResource.actions.find)

  it 'should call policies in FIFO order', ->
    policies = sinon.stub
      get: ->

    policies.get
      .withArgs 'someResource'
      .returns [p1, p2]

    rm = new Resource null, controllerStub.someResource, policies

    handle() for handle in rm.policies

    expect(p1).to.be.calledOnce.and.to.be.calledBefore(p2)
    expect(p2).to.be.calledOnce

  it 'should add policies to the action if it is specified', ->
    policies = sinon.stub
      get: ->

    policies.get
      .withArgs 'someResource', 'find'
      .returns [p1]

    rm = new Resource null, controllerStub.someResource, policies

    expect(rm.policies).to.be.empty
    expect(rm.getAction('find').policies).to.have.length(1)
