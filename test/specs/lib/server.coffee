'use strict'

sinon = require 'sinon'

describe 'Server core', ->

  server = null

  before ->
    mockery.enable
      warnOnUnregistered: false
      useCleanCache: true
    server = require '../../../index'

  after ->
    mockery.disable()

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
    server.hooks.afterStart = sinon.spy server.hooks.afterStart
    server.hooks.afterStop = sinon.spy server.hooks.afterStop
    server
      .start()
      .tap -> expect(server.hooks.afterStart).to.have.been.calledOnce
      .then server.stop
      .tap -> expect(server.hooks.afterStop).to.have.been.calledOnce


