var path = require('path');
var chai = require('chai');
var utils = require('chai/lib/chai/utils');

utils.addMethod(chai.Assertion.prototype, 'path', function (str) {
  new chai.Assertion(this._obj).to.be.equal(str.replace(/\//g, path.sep));
});

utils.addMethod(chai.Assertion.prototype, 'readOnly', function (property) {
  var descriptor = Object.getOwnPropertyDescriptor(this._obj, property);
  new chai.Assertion(descriptor.writable).to.be.false;
});


chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
