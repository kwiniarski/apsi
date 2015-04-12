'use strict';
var _ = require('lodash')
  , fs = require('fs-extra')
  , platform = require('os').platform()
  , path = require('path')
  , util = require('util')
  , support = module.exports
  , CONFIG = require('../config')
  , CAMEL_CASE_RX = /(.)([A-Z])/g
  , DASH_RX = /[^a-z0-9]+(\w)/ig
  , EXTENSION_RX = /\.[a-z0-9]+$/i;


function removeFileExtension(fileName) {
  return fileName.replace(EXTENSION_RX, '');
}

/**
 * Describes a file
 *
 * @example
 * {
 *   file: 'fileName.js'
  *  path: 'lib/drectory/fileName'
  *  name: 'libDirectoryFileName'
 * }
 *
 * @param dir
 * @param file
 * @returns {{file: *, path: *, name}}
 */
function describeModule(dir, file) {
  var relPath = removeFileExtension(path.relative(dir, file));

  if (platform.indexOf('win') >= 0) {
    relPath = relPath.replace(/\\+/g, '/');
  }

  return {
    file: file,
    path: relPath,
    name: support.dashToCamelCase(relPath)
  };
}

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

support.loadModules = function loadModules(dir) {
  try {
    var files = support.loadFiles(dir).map(function (file) {
      return describeModule(dir, file);
    });
    return _.zipObject(_.pluck(files, 'name'), files);
  }
  catch (err) {
    throw new Error('Cannot read files from "' + dir + '": ' + err.stack);
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

support.toLowerCase = function toLowerCase(value) {
  return ('' + value).toLowerCase();
};

var stringToArrayRegExp = /[,\s]+/g;

support.stringToArray = function stringToArray(string) {
  return ('' + string).split(stringToArrayRegExp);
};

var objectRegExp = /^\[object (\S+)\]$/;

support.isObject = function isObject(object) {
  return objectRegExp.test(object.toString());
};

support.require = require;
support.readJsonSync = fs.readJsonSync;
support.readJSONSync = fs.readJSONSync;
