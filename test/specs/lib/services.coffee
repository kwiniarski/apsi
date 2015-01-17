'use strict';

services = null

# jshint -W030
describe 'Service provider', ->

  before ->
    mockery.enable
      warnOnUnregistered: false
      useCleanCache: true

    services = require '../../../lib/services'

  after ->
    mockery.disable()

  describe '_registry object', ->
    it 'should contain resolved service modules paths from application directory', ->
      expect(Object.keys(services._registry).length).to.be.equal 2
      expect(services._registry).to.have.property 'facebook'
      expect(services._registry).to.have.property 'googleApis'

    it 'should be read only', ->
      expect(services).to.be.readOnly '_registry'

  describe 'each service instance', ->
    it 'should be accesible as a property', ->
      expect(services.facebook).to.be.an 'object'
      expect(services.googleApis).to.be.an 'object'

    it 'should be instantiated with the proper configuration object', ->
      expect(services.facebook.config).to.have.property 'apiKey', 'test'
      expect(services.googleApis.config).to.be.null

