/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var express = require('express')
  , eventsLog = require('./lib/log/events')
  , middleware = require('./middleware/index')
  , config = require('./config')
  , server = module.exports
  , application = express();

server.routes = require('./lib/routes');
server.services = require('./services');
server.models = require('./models');
server.application = application;
server.log = eventsLog;

server.instance = null;

server.hooks = {
  afterStart: function () {

    var host = server.instance.address().address
      , port = server.instance.address().port;

    eventsLog.info('server listening at http://%s:%s', host, port);
    eventsLog.info('env %s', config.ENV);
  }
};

server.start = function start(done) {
  server.application.use(middleware);
  server.instance = application.listen(config.PORT, function () {
    server.hooks.afterStart();
    if (done && typeof done === 'function') {
      done();
    }
  });
};

Object.seal(server.hooks);

