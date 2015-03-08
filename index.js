/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var httpPromise = require('http-promise')
  , express = require('express')
  , eventsLog = require('./lib/log/events')
  , middleware = require('./middleware/index')
  , config = require('./config')
  , server = module.exports
  , instance = null
  , application = express();

application.use(middleware);

server.routes = require('./lib/routes');
server.services = require('./services');
server.models = require('./models');
server.application = application;
server.log = eventsLog;

server.hooks = {
  afterStart: function (server) {

    var host = server.address().address
      , port = server.address().port;

    eventsLog.info('server listening at http://%s:%s', host, port);
    eventsLog.info('env %s', config.ENV);
  },
  afterStop: function (server) {
    eventsLog.info('server stopped');
  }
};

server.start = function start() {
  var srv = httpPromise.createServerAsync(application)
    .catch(function (e) {
      eventsLog.error('cannot create application: ' + (e.stack || e.message));
    });

  instance = srv.listen(config.PORT)
    .tap(server.hooks.afterStart)
    .catch(function (e) {
      eventsLog.error('cannot start application: ' + (e.stack || e.message));
    });

  return instance;
};

server.stop = function stop() {
  return instance
    .close()
    .tap(server.hooks.afterStop)
    .catch(function (e) {
      eventsLog.error('cannot stop application: ' + (e.stack || e.message));
    });
};
