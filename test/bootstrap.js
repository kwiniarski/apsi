'use strict';

var path = require('path');
var chai = require('chai');
var utils = require('chai/lib/chai/utils');
var mockery = require('mockery');

/* jshint -W030 */
utils.addMethod(chai.Assertion.prototype, 'path', function (str) {
  new chai.Assertion(this._obj).to.be.equal(str.replace(/\//g, path.sep));
});

utils.addMethod(chai.Assertion.prototype, 'readOnly', function (property) {
  var descriptor = Object.getOwnPropertyDescriptor(this._obj, property);
  new chai.Assertion(descriptor.writable).to.be.false;
});
/* jshint +W030 */

chai.use(require('sinon-chai'));
chai.use(require('chai-http'));
chai.request.addPromises(require('bluebird').Promise);
chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
global.request = chai.request;
global.mockery = mockery;

global.registerMock = function (pathStr, mockObj) {
  mockery.registerMock(pathStr, mockObj);
  mockery.registerMock(path.normalize(pathStr), mockObj);
};
global.deregisterMock = function (pathStr) {
  mockery.deregisterMock(pathStr);
  mockery.deregisterMock(path.normalize(pathStr));
};

