'use strict';

var path = require('path');
var mockery = require('mockery');
var noop = function () {};

function normalizePaths(object) {

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      object[path.normalize(key)] = object[key];
    }
  }

  return object;
}

function Service(config) {
  this.config = config;
}

var filesystemFixture = normalizePaths({
  '/app/api/services' : {
    one: noop,
    two: noop
  },
  '/app/config/services': {
    one: {}
  }
});

var fsStub = {
  readdirSync: function (pathStr) {
    if (filesystemFixture[pathStr]) {
      return Object.keys(filesystemFixture[pathStr]);
    } else {
      throw 'EFIXTURE_ENOENT: ' + pathStr;
    }
  }
};

var modules = normalizePaths({
  fs: fsStub,
  '/app/api/services/one': Service,
  '/app/api/services/two': Service,
  '/app/config/services/one': 1,
  '../config': require('../fixtures/config')
});

module.exports.Service = Service;

module.exports.modules = modules;

//module.exports.setup = function () {
//  mockery.registerAllowables(['../lib/services', 'path', 'fs', 'lodash', '../config']);
//
//  for (var mockName in modules) {
//    if (modules.hasOwnProperty(mockName)) {
//      var mockObject = modules[mockName];
//      mockery.registerMock(mockName, mockObject);
//      mockery.registerAllowable(mockName);
//    }
//  }
//
//  mockery.enable();
//};
//
//module.exports.reset = function () {
//  mockery.disable();
//  mockery.deregisterAll();
//};
