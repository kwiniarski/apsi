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



var modules = normalizePaths({
  '../config': require('../fixtures/config'),
  '/app/config/log-empty': {},
  '/app/config/log': {
    File: {
      stream: process.stdout
    }
  }
});

module.exports.modules = modules;

