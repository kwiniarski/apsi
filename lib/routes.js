var CONFIG = require('../config');
var Router = require('express').Router;
var path = require('path');
var fs = require('fs-extra');

var router = Router();


module.exports = function (_dir) {
  'use strict';

  var log = require('apsi').services.log;

  var DIR_CONTROLLERS = path.resolve(_dir, 'api/controllers');
  var DIR_POLICIES = path.resolve(_dir, 'api/policies');
  var DIR_CONFIG = path.resolve(_dir, 'config');

  var policies = require(path.resolve(DIR_CONFIG, 'policies'));
  var controllers = fs.readdirSync(DIR_CONTROLLERS);

  function getController(_file) {
    var moduleName = path.basename(_file, path.extname(_file));
    var modulePath = path.resolve(DIR_CONTROLLERS, moduleName);
    var moduleData = require(modulePath);

    var controller = {
      file: _file,
      name: moduleName,
      path: modulePath
    };

    for (var key in moduleData) {
      controller[key] = moduleData[key];
    }

    return controller;
  }

  function normalizeRoute(_route) {
    if (_route.indexOf('/') !== 0) {
      _route = '/' + _route;
    }
    return _route;
  }


  controllers.map(getController).forEach(function (_controller) {
    var controllerRouter = Router();

    for (var actionName in _controller.actions) {
      var action = _controller.actions[actionName];
      var method = action.method || ['use'];
      var context = normalizeRoute(_controller.context);

      if (method instanceof Array === false) {
        method = [method];
      }

      method.forEach(function (_method) {
        controllerRouter[_method.toLowerCase()](normalizeRoute(action.route), action.fn);
        log.debug('Mounting route %s %s%s', _method.toUpperCase(), context, action.route);
      });

      router.use(context, controllerRouter);
    }

  });

  return router;
};
