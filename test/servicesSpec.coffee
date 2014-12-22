'use strict';

mock      = require './mocks/services'
services  = null

# jshint -W030
describe 'Service provider', ->

  beforeEach ->
    setup mock.modules
    services = require '../lib/services'

  afterEach reset

  describe 'registry object', ->
    it 'should contain resolved service modules paths from application directory', ->
      expect(Object.keys(services._registry).length).to.be.equal(2)
      expect(services._registry).to.have.property('one').that.is.path('/app/api/services/one')
      expect(services._registry).to.have.property('two').that.is.path('/app/api/services/two')

    it 'should be read only', ->
      expect(services).to.be.readOnly('_registry')

  describe 'each service instance', ->
    it 'should be accesible as a property', ->
      expect(services.one).to.be.instanceOf(mock.Service)
      expect(services.two).to.be.instanceOf(mock.Service)

    it 'should be instantiated with the proper configuration object', ->
      expect(services.one.config).to.equal(1)
      expect(services.two.config).to.be.null

