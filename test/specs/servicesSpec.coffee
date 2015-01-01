'use strict';

configFixture = require '../fixtures/config'
mockery = require 'mockery'
fs = require 'fs'
path = require 'path'
sinon = require 'sinon'

services = null
fsStub = null

Service = (config) ->
  this.config = config
  return

# jshint -W030
describe 'Service provider', ->

  before ->

    fsStub = sinon.stub fs, 'readdirSync'
    fsStub.withArgs(path.normalize '/app/api/services').returns ['one', 'two']
    fsStub.withArgs(path.normalize '/app/config/services').returns ['one']
    fsStub.throws 'STUB_ENOENT'

    registerMock '../config', configFixture
    registerMock '/app/api/services/one', Service
    registerMock '/app/api/services/two', Service
    registerMock '/app/config/services/one', 1
    mockery.enable
      warnOnUnregistered: false
      warnOnReplace: false
      useCleanCache: true

    services = require '../../lib/services'

  after ->

    fsStub.restore()
    mockery.disable()

  describe '_registry object', ->
    it 'should contain resolved service modules paths from application directory', ->
      expect(Object.keys(services._registry).length).to.be.equal 2
      expect(services._registry).to.have.property('one').that.is.path '/app/api/services/one'
      expect(services._registry).to.have.property('two').that.is.path '/app/api/services/two'

    it 'should be read only', ->
      expect(services).to.be.readOnly '_registry'

  describe 'each service instance', ->
    it 'should be accesible as a property', ->
      expect(services.one).to.be.instanceOf Service
      expect(services.two).to.be.instanceOf Service

    it 'should be instantiated with the proper configuration object', ->
      expect(services.one.config).to.equal 1
      expect(services.two.config).to.be.null

