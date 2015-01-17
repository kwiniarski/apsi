#!/usr/bin/env node
'use strict';

process.bin = process.title = 'surf';

var program = require('commander')
  , fs = require('fs-extra')
  , path = require('path')
  , pkg = fs.readJsonFileSync(path.resolve(__dirname, '../package.json'))
  , LIB_MODELS = path.resolve(__dirname, '../lib/models')
  , LIB_SERVER = path.resolve(__dirname, '../lib/server');

program.version(pkg.version)
  .option('-b, --baseDir <path>', 'point new base dir', function (dir) {
    return path.resolve(process.cwd(), dir);
  })
  .option('-f, --force', 'make some commands more agresive');

program
  .command('sync')
  .description('Synchronize database')
  .action(function () {
    configure(this);
    require(LIB_MODELS).sequelize.sync({
      force: !!this.parent.force
    });
  });

program
  .command('migrate')
  .description('Migrate database')
  .option('-s, --sync', 'synchronize before migration')
  .option('-t, --type [type]', 'migration type [up|down]', 'up')
  .action(function () {
    var config = configure(this)
      , db = require(LIB_MODELS).sequelize;

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
    require(LIB_SERVER).start();
  });


program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}

function configure(program) {
  global.args = {};
  global.args.BASE_DIR = program.parent.baseDir;
  global.args.PORT = program.port;

  Object.freeze(global.args);

  // Initialize config
  return require('../config');
}
