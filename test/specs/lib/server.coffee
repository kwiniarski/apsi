'use strict'

sinon = require 'sinon'
server = null

describe 'Server core', ->

  server = null

  before (done) ->
    mockery.enable
      warnOnUnregistered: false
      useCleanCache: true

    server = require '../../../index'
    server.hooks.afterStart = sinon.spy(server.hooks.afterStart)

    server.start done

  after (done) ->
    mockery.disable()
    server.instance.on 'close', done
    server.instance.close()

  it 'should expose services when required', ->
    expect(server).to.have.property 'services'

  it 'should expose models when required', ->
    expect(server).to.have.property 'models'

  it 'should expose routes when required', ->
    expect(server).to.have.property 'routes'

  it 'should expose events log when required', ->
    expect(server).to.have.property 'log'

  it 'should expose application object when required', ->
    expect(server).to.have.property 'application'

  it 'should start application on selected port', ->
    expect(server.hooks.afterStart).to.have.been.calledOnce


