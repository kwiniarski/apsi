/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var services = null;

describe('Service provider', function () {
  before(function () {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    services = require('../../../services/index');
  });
  after(function () {
    mockery.disable();
  });
  describe('_registry object', function () {
    it('should contain resolved service modules paths from application directory', function () {
      expect(Object.keys(services._registry).length).to.be.equal(2);
      expect(services._registry).to.have.property('facebook');
      expect(services._registry).to.have.property('googleApis');
    });
    it('should be read only', function () {
      expect(services).to.be.readOnly('_registry');
    });
  });
  describe('each service instance', function () {
    it('should be accesible as a property', function () {
      expect(services.facebook).to.be.an('object');
      expect(services.googleApis).to.be.an('object');
    });
    it('should be instantiated with the proper configuration object', function () {
      expect(services.facebook.config).to.have.property('apiKey', 'test');
      expect(services.googleApis.config).to.be.null;
    });
  });
});
