/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var Router = require('express').Router
  , controllers = require('./controllers')
  , RequestError = require('./errors').RequestError
  , router = new Router()
  , routes = {};

function aggregateActions(controller, aggregate) {
  for (var actionName in controller) {
    var action = controller[actionName];
    aggregate[action.route] = aggregate[action.route] || {
      path: action.route,
      methods: {}
    };

    for (var i = 0, j = action.methods.length; i < j; i++) {
      aggregate[action.route].methods[action.methods[i]] = action.fn;
    }
  }
}

function mountActions(controller, name) {

  var controllerRouter = new Router()
    , actions = new Router()
    , mountPath = '/' + name
    , methodNotAllowed = function methodNotAllowed(req, res, next) {
        next(RequestError.MethodNotAllowed());
      };

  for (var id in controller) {
    var route = controller[id]
      , actionRoute = actions.route(route.path)
      , actionMethods = route.methods;

    for (var method in actionMethods) {
      actionRoute[method](actionMethods[method]);
    }

    // All missing VERBs, except GET and HEAD, should respond with 405 Method Not Allowed status code.
    // TODO: Add an Allow header containing a list of valid methods for 405 error code.
    // TODO: GET and HEAD must never be disabled and should not return 405 error code.
    actionRoute.all(methodNotAllowed);
  }

  actions.use(function (req, res, next) {
    next(RequestError.NotFound());
  });

  controllerRouter.use(mountPath, actions);

  return controllerRouter;
}

for (var ctrlName in controllers) {
  routes[ctrlName] = {};

  aggregateActions(controllers[ctrlName], routes[ctrlName]);
  aggregateActions(controllers._replaced[ctrlName], routes[ctrlName]);

  router.use('/', mountActions(routes[ctrlName], ctrlName));
}

module.exports = router;


