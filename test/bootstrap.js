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


global.setup = function (modules, cleanCache) {
  mockery.enable({
    warnOnUnregistered: false,
    useCleanCache: cleanCache || false
  });

  for (var mockName in modules) {
    if (modules.hasOwnProperty(mockName)) {
      mockery.registerMock(mockName, modules[mockName]);
    }
  }
};

global.reset = function () {
  mockery.disable();
  mockery.deregisterAll();
};
