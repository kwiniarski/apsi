/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var sinon = require('sinon');

describe('errors-handler middleware', function () {
  var middleware, req, res;
  req = null;
  res = null;
  middleware = null;
  beforeEach(function () {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    req = require('../../mocks/express-request')();
    res = require('../../mocks/express-response')();
    res.status = sinon.spy(res.status);
    res.json = sinon.spy(res.json);
    middleware = require('../../../middleware/errors-handler');
  });
  afterEach(mockery.disable);
  describe('status code support', function () {
    it('should set status code from error object', function () {
      var error;
      error = new Error('Request error');
      error.status = 501;
      middleware(error, req, res);
      expect(res.status).to.have.been.calledWith(501);
      expect(res.json).to.have.been.calledWith(error);
    });
    it('should have default status code 500', function () {
      var error;
      error = new Error('Request error');
      middleware(error, req, res);
      expect(res.status).to.have.been.calledWith(500);
    });
  });
});


