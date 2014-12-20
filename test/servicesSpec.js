'use strict';


var mocks = require('./mocks/services');
var asserts = require('./asserts/services');
var mockery = require('mockery');
var path = require('path');
var services;

mockery.registerAllowables(['../src/services', 'path', 'fs', 'lodash', '../../config']);
for (var mock in mocks.modules) {
  mockery.registerMock(mock, mocks.modules[mock]);
  mockery.registerAllowable(mock);
}

//console.log(mocks.modules['../../config']);

var chai = require('chai');
var expect = chai.expect;

describe('Service Loader', function () {

  beforeEach(function () {
    mockery.enable();
    services = require('../src/services');
  });

  afterEach(function () {
    mockery.disable();
  });

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
