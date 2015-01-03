'use strict';

var program = require('commander');
var express = require('express');
var util = require('./lib/support');
var services = require('./lib/services');
var routes = require('./lib/routes');
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
var surf = {};

function bootstrap() {
  surf.services = services.load(options.baseDir + '/config');
  policies.register(surf.services);
}

function server() {

  var app = express();
  var log = surf.services.log;

  app.use(log.http);

  app.use(require('body-parser').json());
  app.use(policies.passport.authenticate('surf-client', {session: false}));

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

  var log = surf.services.log;
  var db = surf.services.db;

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
  var log = surf.services.log;
  var migrator = surf.services.db.sequelize.getMigrator({
    path: options.baseDir + '/migrations'
  });

  return migrator.migrate({
    method: method || program.migrate
  }).success(function() {
    log.info('Migration complete.');
  });

}

surf.util = utils;

surf.services = {};

surf.config = function (_options) {
  options = _options;
};

surf.start = function () {

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

surf.migrate = function (method) {
  var migrator = surf.services.db.sequelize.getMigrator({
    path: options.baseDir + '/migrations'
  });

  migrator.migrate({
    method: method
  }).success(function() {
    console.log(arguments);
  });

};





module.exports = surf;

