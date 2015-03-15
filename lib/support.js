'use strict';
var _ = require('lodash')
  , fs = require('fs-extra')
  , path = require('path')
  , support = module.exports
  , CAMEL_CASE_RX = /(.)([A-Z])/g
  , DASH_RX = /-+(\w)/g;


support.loadFiles = function loadFiles(dir) {
  var list = []
    , files = fs.readdirSync(dir);

  files.forEach(function (file) {
    var filePath = path.join(dir, file)
      , stats = fs.lstatSync(filePath);

    list = list.concat(stats.isDirectory() ? loadFiles(filePath) : filePath);
  });

  return list;
};

support.listFiles = function listFiles(dir) {
  try {
    var files = support.loadFiles(dir)
      , moduleNames = _.map(files, function (file) {
          return path.basename(file, path.extname(file));
        }).map(support.dashToCamelCase);

    return _.zipObject(moduleNames, files);
  }
  catch (err) {
    throw 'Cannot read files from "' + dir + '": ' + err.stack;
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
