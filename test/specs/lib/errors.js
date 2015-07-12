/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var errors = require('../../../lib/errors');
var RequestError = errors.RequestError;
var requestError = null;
var error = null;

describe('RequestError', function () {
  beforeEach(function () {
    requestError = new RequestError();
    error = new Error('Application error');
  });
  describe('constructor', function () {
    it('should extend Error object', function () {
      expect(requestError).to.be.an.instanceof(RequestError);
      expect(requestError).to.be.an.instanceof(Error);
    });
  });
  describe('status code', function () {
    it('should default to 500 Internal Server Error', function () {
      expect(requestError).to.have.property('status', 500);
    });
    it('should default to 500 Internal Server Error when status code is ommited', function () {
      requestError = new RequestError(error);
      expect(requestError).to.have.property('status', 500);
      expect(requestError).to.have.property('name', 'Internal Server Error');
      expect(requestError).to.have.property('message', 'Application error');
    });
  });
  describe('error message', function () {
    it('should default to passed HTTP status code if not provided directly', function () {
      expect((new RequestError(404)).toString()).to.equal('Not Found: Not Found');
    });
    it('should be accepted as a string', function () {
      expect((new RequestError(404, 'Resource not found')).toString()).to.equal('Not Found: Resource not found');
    });
    it('should be accepted as an Error instance', function () {
      requestError = new RequestError(404, error);
      expect(requestError.toString()).to.equal('Not Found: Application error');
      expect(requestError.stack).to.contain('Error: Application error');
    });
  });
  describe('status methods', function () {
    it('should have NotFound static method', function () {
      requestError = RequestError.NotFound();
      expect(requestError).to.have.property('status', 404);
      expect(requestError.toString()).to.equal('Not Found: Not Found');
    });
  });
});

