'use strict';
var _ = require('lodash')
  , fs = require('fs-extra')
  , path = require('path')
  , support = module.exports
  , CAMEL_CASE_RX = /(.)([A-Z])/g
  , DASH_RX = /-+(\w)/g;


support.loadFiles = function loadFiles(dir) {
  return fs.readdirSync(dir);
};

support.listFiles = function listFiles(dir) {
  try {
    var files = fs.readdirSync(dir);
    var modules = _.map(files, function (file) {
      return path.join(dir, file);
    });

    return _.zipObject(files, modules);
  }
  catch (err) {
    throw 'Cannot read files from ' + dir + err;
  }
};

support.isCamelCase = function isCamelCase(string) {
  return !!CAMEL_CASE_RX.test(string);
};

support.camelCaseToDash = function camelCaseToDash(string) {
  return string.replace(CAMEL_CASE_RX, function (match, a, b) {
    return [a, b].join('-');
  }).toLowerCase();
};

support.dashToCamelCase = function dashToCamelCase(string) {
  return string.replace(DASH_RX, function (match, a) {
    return a.toUpperCase();
  });
};
