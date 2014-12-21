'use strict';

var program = require('commander');
var express = require('express');
var util = require('./lib/util');
var services = require('./lib/services');
var routes = require('./routes');
var policies = require('./lib/policies');
var dev = true;

program.version('0.0.1')
  .option('-p, --port [number]', 'Port number')
  .option('-i, --init', 'Use this flag to allow sync and migrations')
  .option('-s, --sync', 'Synchronize database')
  .option('-m, --migrate [type]', 'Migration type [up|down]', 'up')
  .option('-f, --force', 'Make some commands more agresive')
  .parse(process.argv);


var options = {};
var apsi = {};

function bootstrap() {
  apsi.services = services.load(options.baseDir + '/config');
  policies.register(apsi.services);
}

function server() {

  var app = express();
  var log = apsi.services.log;

  app.use(log.http);
  app.use(require('./lib/response'));
  app.use(require('body-parser').json());
  app.use(policies.passport.authenticate('apsi-client', {session: false}));

  app.use(routes(options.baseDir));

  //app.post('/', function (req, res) {
  //  //console.log(req.client);
  //  res.json(req.user);
  //});

  /* jshint unused: false */
  // error handler
  app.use(function (err, req, res, next) {
    log.error(err.message, err.stack);

    res.status(err.status || 500);
    res.json({
      message: err.message,
      // development env will print stacktrace
      // on production no stacktraces leaked to user
      error: dev ? err : {}
    });
  });
  /* jshint unused: true */


  var serverInstance = app.listen(program.port || 3000, function () {

    var host = serverInstance.address().address;
    var port = serverInstance.address().port;

    log.info('API listening at http://%s:%s', host, port);
  });

  return app;
}

function synchronize() {

  var log = apsi.services.log;
  var db = apsi.services.db;

  return db.sequelize.sync({
    log: log.debug,
    force: program.force
  }).success(function(_res){
    log.info('Synchronization complete.');
  }).error(function(_error){
    log.error(_error.message, _error);
  });
}

function migrate(method) {
  var log = apsi.services.log;
  var migrator = apsi.services.db.sequelize.getMigrator({
    path: options.baseDir + '/migrations'
  });

  return migrator.migrate({
    method: method || program.migrate
  }).success(function() {
    log.info('Migration complete.');
  });

}

apsi.util = util;

apsi.services = {};

apsi.config = function (_options) {
  options = _options;
};

apsi.start = function () {

  bootstrap();

  if (program.init) {
    if (program.sync) {
      return synchronize();
    }

    else if (program.migrate) {
      return migrate();
    }
  }

  else {
    return server();
  }

};

apsi.migrate = function (method) {
  var migrator = apsi.services.db.sequelize.getMigrator({
    path: options.baseDir + '/migrations'
  });

  migrator.migrate({
    method: method
  }).success(function() {
    console.log(arguments);
  });

};





module.exports = apsi;

