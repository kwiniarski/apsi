'use strict'

sinon = require 'sinon'
ResourceAction = require '../../../../lib/resource/action'
actionWrapper = require '../../../../lib/resource/action-wrapper'

describe 'ResourceAction', ->

  beforeEach ->
    @handler = sinon.spy()
    @handler.id = 'actionName'
    @action = new ResourceAction @handler

  it 'should throw error when handler is not a function', ->
    expect(-> new ResourceAction).to.throw

  it 'should throw error when handler has no id', ->
    handler = sinon.spy()
    expect(-> new ResourceAction handler).to.throw

  it 'should set mountPath using id, when mountPath is not given', ->
    expect(@action.mountPath).to.equal '/action-name'

  it 'should have default value for policies', ->
    expect(@action.policies).to.eql []

  it 'should have default value for methods', ->
    expect(@action.methods).to.eql ['GET']

  it 'should provide method to add more policies', ->
    @action.registerPolicies(sinon.spy());
    expect(@action.policies).to.have.length 1
