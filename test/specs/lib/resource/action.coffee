'use strict'

sinon = require 'sinon'
ResourceAction = require '../../../../lib/resource/action'

describe.only 'ResourceAction', ->

  it 'should apply handler and policies with the configured methods to the provided router object', ->

    router =
      get: sinon.spy()
      put: sinon.spy()

    config =
      handler: sinon.spy()
      policies: []
      methods: ['GET', 'PUT']
      mountPath: '/'

    ra = new ResourceAction config
    ra.setupRouter router

    expect(router.get).to.have.been.calledWith '/', [], config.handler
    expect(router.put).to.have.been.calledWith '/', [], config.handler
