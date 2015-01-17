'use strict'

configFixture = require '../fixtures/config'
support = require '../../lib/support'
sinon = require 'sinon'
path = require 'path'

describe 'Server core', ->

  server = null
  loadFilesStub = null
  listFilesStub = null

  before (done) ->
    loadFilesStub = sinon.stub support, 'loadFiles'
    loadFilesStub.withArgs(path.normalize '/app/api/models').returns []
    listFilesStub = sinon.stub support, 'listFiles'
    listFilesStub.withArgs(path.normalize '/app/api/controllers').returns []

    registerMock configFixture.ACCESS_LOG_CONFIG, {}
    registerMock configFixture.EVENTS_LOG_CONFIG, {}
    registerMock configFixture.MODELS_CONFIG,
      connection:
        database: 'test_surf'
        user: process.env.USER
        password: '',
    registerMock configFixture.CONTROLLERS_CONFIG, {}
    registerMock configFixture.POLICIES_CONFIG, {}
    registerMock './support', support
    registerMock '../config', configFixture
    registerMock '../../config', configFixture
    registerMock './services', {}
    registerMock './models', {}
    registerMock './routes', {}
    registerMock './log/events',
      info: ->

    mockery.enable
      warnOnUnregistered: false
      warnOnReplace: false
      useCleanCache: true

    server = require '../../lib/server'

    server.hooks.afterStart = sinon.spy(server.hooks.afterStart)
    server.start done

  after ->
    loadFilesStub.restore()
    listFilesStub.restore()

    mockery.deregisterAll()
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
    expect(server.hooks.afterStart).to.have.been.calledOnce


