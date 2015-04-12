'use strict'

sinon = require 'sinon'
ResourceAction = require '../../../../lib/resource/action'

describe 'ResourceAction', ->

  router =
    get: sinon.spy()
    put: sinon.spy()

  beforeEach ->
    router.get.reset()
    router.put.reset()

  it 'should apply handler and policies with the configured methods to the provided router object', ->

    config =
      name: 'actionName',
      handler: sinon.spy()
      policies: [sinon.spy()]
      methods: ['GET', 'PUT']
      mountPath: '/action'

    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/action', config.policies, config.handler
    expect(router.put).to.have.been.calledWith '/action', config.policies, config.handler

  it 'should default config.mountPath to "/" if not present', ->

    config =
      name: 'actionName',
      handler: sinon.spy()

    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/', [], config.handler

  it 'should default config.methods to GET if not present', ->

    config =
      name: 'actionName',
      handler: sinon.spy()

    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/', [], config.handler

  it 'should default config.policies to an empty collection if not present', ->

    config =
      name: 'actionName',
      handler: sinon.spy()

    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/', [], config.handler
