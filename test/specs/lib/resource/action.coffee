'use strict'

sinon = require 'sinon'
ResourceAction = require '../../../../lib/resource/action'
actionWrapper = require '../../../../lib/resource/action-wrapper'

describe.skip 'ResourceAction', ->

  router =
    get: sinon.spy()
    put: sinon.spy()

  beforeEach ->
    router.get.reset()
    router.put.reset()

  it 'should apply handler and policies with the configured methods to the provided router object', ->

    config = actionWrapper sinon.spy()
    config.id = 'actionName'
    config.policies = [sinon.spy()]
    config.methods = ['GET', 'PUT']
    config.mountPath = '/action'



    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/action', config.policies, config
    expect(router.put).to.have.been.calledWith '/action', config.policies, config

  it 'should default config.mountPath to action.id translated to lowercase dash ("/action-name")', ->

    config = actionWrapper sinon.spy()
    config.id = 'actionName'

    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/action-name', [], config

  it 'should default config.methods to GET if not present', ->

    config = actionWrapper sinon.spy()
    config.id = 'actionName'

    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/action-name', [], config

  it 'should default config.policies to an empty collection if not present', ->

    config = actionWrapper sinon.spy()
    config.id = 'actionName'

    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/action-name', [], config
