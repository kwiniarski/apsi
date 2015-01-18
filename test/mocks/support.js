/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var support = require('../../lib/support'),
    path = require('path');

//support.loadFiles = function loadFiles(dir) {
//
//};
//
//support.listFiles = function listFiles(dir) {
//  try {
//    var files = fs.readdirSync(dir)
//      , moduleNames = _.map(files, function (file) {
//        return path.basename(file, path.extname(file));
//      }).map(support.dashToCamelCase)
//      , modules = _.map(files, function (file) {
//        return path.join(dir, file);
//      });
//
//    return _.zipObject(moduleNames, modules);
//  }
//  catch (err) {
//    throw 'Cannot read files from "' + dir + '": ' + err.stack;
//  }
//};

//stubs.listFiles = sinon.stub(support, 'listFiles');

for (var i in support) {
  module.exports[i] = support[i];
}

module.exports.loadFiles = function(dir) {
  return support.loadFiles(path.resolve('test', dir));
};

module.exports.listFiles = function(dir) {
  return support.listFiles(path.resolve('test', dir));
};
