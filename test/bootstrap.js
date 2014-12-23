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
chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

//global.normalizePaths = function (object) {
//
//  for (var key in object) {
//    if (object.hasOwnProperty(key)) {
//      object[path.normalize(key)] = object[key];
//    }
//  }
//
//  return object;
//};

global.setup = function (modules) {
  mockery.enable({
    warnOnUnregistered: false,
    warnOnReplace: false,
    useCleanCache: true
  });

  for (var mockName in modules) {
    if (modules.hasOwnProperty(mockName)) {
      mockery.registerMock(mockName, modules[mockName]);
      mockery.registerMock(path.normalize(mockName), modules[mockName]);
    }
  }
};

global.reset = function () {
  mockery.deregisterAll();
  mockery.resetCache();
  mockery.disable();
};
