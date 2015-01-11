/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var express = require('express')
  , eventsLog = require('../log/events')
  , middleware = require('../../middleware')
  , config = require('../../config')
  , server = module.exports
  , application = express();

server.services = require('../services');
server.models = require('../models');
server.routes = require('../routes');
server.log = eventsLog;
server.application = application;
server.instance = null;

server.hooks = {
  afterStart: function () {

    var host = server.instance.address().address
      , port = server.instance.address().port;

    eventsLog.info('Server listening at http://%s:%s', host, port);
  }
};

server.start = function start(done) {
  application.use(middleware);
  server.instance = application.listen(config.PORT, function () {
    server.hooks.afterStart();
    if (done && typeof done === 'function') {
      done();
    }
  });
};

Object.seal(server.hooks);

