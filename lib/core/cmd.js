/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 *
 * Command line processor. It allows to overwrite some configuration values
 * but it should not set any default, as they are set in config.js.
 */

'use strict';

var program = require('commander')
  , fs = require('fs-extra')
  , path = require('path')
  , pkg = fs.readJsonFileSync('../../package.json');

program.version(pkg.version)
  .option('-b, --baseDir <dir>', 'Point new base dir', function (dir) {
    return path.resolve(process.cwd(), dir);
  })
  .option('-f, --force', 'Make some commands more agresive');

program
  .command('db')
  .description('Database synchronization')
  .option('-s, --sync', 'Synchronize database')
  .option('-m, --migrate [type]', 'Migration type [up|down]', 'up')
  .action(function () {});

program
  .command('start')
  .description('Start Surf server on specified port')
  .option('-p, --port [number]', 'Port number', Number)
  .action(function () {

  });

program.parse(process.argv);

global.args = {};
global.args.BASE_DIR = program.baseDir;
global.args.PORT = program.port;

Object.freeze(global.args);

// Initialize config
require('../../config');

