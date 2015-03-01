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
    var action = controller[actionName]
      , route
      , routes = (action.route instanceof Array)
        ? action.route
        : [action.route];

    for (var i = 0, j = routes.length; i < j; i++) {
      route = routes[i];
      aggregate[route] = aggregate[route]  || {
        name: actionName,
        path: route,
        methods: {}
      };

      for (var k = 0, l = action.methods.length; k < l; k++) {
        aggregate[route].methods[action.methods[k]] = action.fn;
      }

    }
  }
}

function mountController(controller, name) {

  var controllerRouter = new Router()
    , actions = new Router()
    , policy = policies[name] || policies._all
    , mountPath = '/' + name;

  if (!policy || policy.passThrough()) {
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


