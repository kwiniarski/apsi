/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var argv = process.argv;

if (argv.length > 1 && argv[0].indexOf('node') !== -1 && argv[1].indexOf('mocha') !== -1) {
  return; // do not execute this file during simple tests
}

var path = require('path');
var glob = require('glob');
var fs = require('fs-extra');
var blanket = require('blanket')();

var COVERAGE_DIR = './test-coverage';

glob.sync('./{lib,middleware}/**/*.js').forEach(function (file) {
  var filePath = path.resolve(process.cwd(), file);
  var fileData = fs.readFileSync(filePath).toString();
  try {
    blanket.instrument({
      inputFile: fileData,
      inputFileName: file
    }, function (instrumented) {
      var coveredFile = path.resolve(process.cwd(), COVERAGE_DIR, file);
      fs.ensureFileSync(coveredFile);
      fs.writeFileSync(coveredFile, instrumented);
    });
  } catch (err) {
    console.log(file, err.message);
  }
});

fs.copySync(path.resolve(process.cwd(), './test'), path.resolve(process.cwd(), COVERAGE_DIR, './test'));
