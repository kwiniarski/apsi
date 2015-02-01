/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var Router = require('express').Router
  , RequestError = require('../lib/errors').RequestError
  , controllers = require('./controllers')
  , policies = require('./policies')
  , eventsLog = require('../lib/log/events')
  , router = new Router()
  , routes = {};

function notFound(req, res, next) {
  next(RequestError.NotFound());
}

function methodNotAllowed(req, res, next) {
  next(RequestError.MethodNotAllowed());
}

function aggregateActions(controller, aggregate) {
  for (var actionName in controller) {
    var action = controller[actionName];
    aggregate[action.route] = aggregate[action.route] || {
      name: actionName,
      path: action.route,
      methods: {}
    };

    for (var i = 0, j = action.methods.length; i < j; i++) {
      aggregate[action.route].methods[action.methods[i]] = action.fn;
    }
  }
}

function mountController(controller, name) {

  var controllerRouter = new Router()
    , actions = new Router()
    , policy = policies[name]
    , mountPath = '/' + name;

  if (!policy || !policy.isRestricted()) {
    mountActions(controller, actions, policy);
  }

  actions.use(notFound);

  controllerRouter.use(mountPath, actions);

  eventsLog.debug('controller mounted', name, mountPath);
  return controllerRouter;
}

function mountActions(controller, actions, policy) {
  for (var id in controller) {
    var action = controller[id]
      , actionRoute = actions.route(action.path)
      , actionMethods = action.methods;

    for (var method in actionMethods) {
      // Inject policies before action
      var callQueue = [actionMethods[method]];
      if (policy) {
        callQueue = policy.get(action.name).concat(callQueue);
      }
      // Mount policies and action under given HTTP method
      actionRoute[method](callQueue);
      eventsLog.debug('action mounted', action.name, method, action.path);
    }

    // All missing VERBs, except GET and HEAD, should respond with 405 Method Not Allowed status code.
    // TODO: Add an Allow header containing a list of valid methods for 405 error code.
    // TODO: GET and HEAD must never be disabled and should not return 405 error code.
    actionRoute.all(methodNotAllowed);
  }
}

for (var ctrlName in controllers) {
  routes[ctrlName] = {};

  aggregateActions(controllers[ctrlName], routes[ctrlName]);
  aggregateActions(controllers._replaced[ctrlName], routes[ctrlName]);

  router.use('/', mountController(routes[ctrlName], ctrlName));
}

module.exports = router;


