'use strict';

var mock = require('./mock');
var mocks = require('./mocks/services');
var asserts = require('./asserts/services');
var services = mock.module('node_modules/apsi/services/index.js', mocks.modules, mocks.globals);

var chai = require('chai');
var expect = chai.expect;

describe('Service Loader', function () {

  describe('registry object', function () {
    it('should contain resolved service modules paths from default locations', function () {
      var resolvedServicesCount = Object.keys(services._registry).length;
      expect(resolvedServicesCount).to.be.equal(3);

      expect(services._registry).to.have.property('one').that.is.path('/app/api/services/one');
      expect(services._registry).to.have.property('two').that.is.path('/app/api/services/two');
      expect(services._registry).to.have.property('three').that.is.path('/app/node_modules/app/services/three');
    });
    it('should be read only', function () {
      expect(function () {
        delete services._registry;
      }).to.throw;
      expect(function () {
        services._registry = null;
      }).to.throw;
      expect(function () {
        services._registry.one = null;
      }).to.throw;
    });
  });

  describe('service instance', function () {
    it('should be accesible as a property', function () {
      expect(services.one).to.be.instanceOf(mocks.Service);
      expect(services.two).to.be.instanceOf(mocks.Service);
      expect(services.three).to.be.instanceOf(mocks.Service);
    });
    it('should be instantiated with the right configuration object', function () {
      expect(services.one.config).to.equal(1);
      expect(services.two.config).to.equal(2);
      expect(services.three.config).to.be.null;
    });
  });

});
