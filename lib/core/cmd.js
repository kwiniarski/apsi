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
  .option('-b, --baseDir <path>', 'Point new base dir', function (dir) {
    return path.resolve(process.cwd(), dir);
  })
  .option('-f, --force', 'Make some commands more agresive');

program
  .command('sync')
  .description('Synchronize database')
  .action(function () {
    configure(this);
    require('../models').sequelize.sync({
      force: !!this.parent.force
    });
  });

program
  .command('migrate')
  .description('Migrate database')
  .option('-s, --sync', 'Synchronize before migration')
  .option('-t, --type [type]', 'Migration type [up|down]', 'up')
  .action(function () {
    var config = configure(this)
      , db = require('../models').sequelize;

    if (this.sync) {
      db.sync({
        force: !!this.parent.force
      });
    }

    //TODO: Replace sequelize migration engine with umzug
    db.getMigrator({
      path: config.MIGRATIONS_DIR
    }).migrate({
      method: this.type
    }).success(function () {
      console.log('Migration complete.');
    });

  });

program
  .command('start')
  .description('Start Surf server on specified port')
  .option('-p, --port [number]', 'Port number', Number)
  .action(function () {
    configure(this);
    require('./server').start();
  });


program.parse(process.argv);


function configure(program) {
  global.args = {};
  global.args.BASE_DIR = program.parent.baseDir;
  global.args.PORT = program.port;

  Object.freeze(global.args);

  // Initialize config
  return require('../../config');
}
