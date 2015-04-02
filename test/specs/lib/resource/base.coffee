'use strict'

sinon = require 'sinon'
#express = require 'express'
ResourceBase = require '../../../../lib/resource/base'
ResourceAction = require '../../../../lib/resource/action'
ResourceGenericActions = require '../../../../lib/resource/action-blueprint'
ResourceGenericActionsStub = null

modelStub = sinon.stub
  someResource:
    path: 'some/resource'
  anotherResource:
    path: 'another/resource'

controllerStub = sinon.stub
  someResource:
    path: 'some/resource'
    find:
      name: 'find'
      handler: sinon.spy()
    controllerAction:
      name: 'controllerAction'


describe 'ResourceBase', ->

  it 'should throw error when passed model and controller do not match the same path', ->
    expect -> new ResourceBase modelStub.anotherResource, controllerStub.someResource
      .to.throw 'Mount path for model and controller do not match'

  it 'should throw error when mount path was not set properly', ->
    expect -> new ResourceBase()
      .to.throw 'Cannot initialize resource without mount path'

  it 'should return actions returned by controller', ->
    rm = new ResourceBase modelStub.someResource, controllerStub.someResource
    expect(rm.getAction 'controllerAction').to.be.instanceof(ResourceAction)

  it 'should return generic actions created for model model', ->
    rm = new ResourceBase modelStub.someResource
    expect(rm.getAction 'find').to.be.instanceof(ResourceAction)

  it 'should return controller actions before model actions if both are defined', ->
    genericFindStub = sinon.stub ResourceGenericActions.prototype.find, 'handler'

    rm = new ResourceBase modelStub.someResource, controllerStub.someResource
    rm.getAction('find')._handler()

    expect(genericFindStub).to.not.have.been.called
    expect(controllerStub.someResource.find.handler).to.have.been.calledOnce

    genericFindStub.restore()

  it 'should call policies in FIFO order', ->
    rm = new ResourceBase null, controllerStub.someResource
    rm.registerPolicy p1 = sinon.spy()
    rm.registerPolicy p2 = sinon.spy()

    handle() for handle in rm._policies

    expect(p1).to.be.calledOnce.and.to.be.calledBefore(p2)
    expect(p2).to.be.calledOnce

  it 'should add policies to the action if it is specified', ->
    rm = new ResourceBase null, controllerStub.someResource
    rm.registerPolicy p1 = sinon.spy(), ['find']

    expect(rm._policies).to.be.empty
    expect(rm.getAction('find')._policies).to.have.length(1)

  it 'should not mix actions from different resources', ->
    genericFindStub = sinon.stub ResourceGenericActions.prototype.find, 'handler'

    rm1 = new ResourceBase modelStub.someResource
    rm2 = new ResourceBase modelStub.someResource

    rm1.getAction('find')._handler()

    expect(genericFindStub).to.have.been.calledOnce

    genericFindStub.restore()

