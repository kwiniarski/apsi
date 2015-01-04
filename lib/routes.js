'use strict';

var Router = require('express').Router;
var _ = require('lodash');
var models = require('./models');
var controllers = require('./controllers');
var blueprints = require('./blueprints');
var RequestError = require('./errors').RequestError;
var routes = new Router();

function aggregateRoutes(routes, aggregate) {
  for (var actionName in routes) {
    var action = routes[actionName];
    aggregate[action.route] = aggregate[action.route] || {
      path: action.route,
      methods: {}
    };

    for (var i = 0, j = action.methods.length; i < j; i++) {
      aggregate[action.route].methods[action.methods[i]] = action.fn;
    }
  }
}

function mountActions(model, name) {

  var controllerRouter = new Router()
    , actions = new Router()
    , controller = controllers[name] || {}
    , overwrittenActions = {}
    , mountPath = '/' + name
    , actionName
    , groupedRoutes = {}
    , blueprint = blueprints.getDefaultActions(model, name)
    , methodNotAllowed = function methodNotAllowed(req, res, next) {
        next(RequestError.MethodNotAllowed());
      };

  for (actionName in blueprint) {
    if (!controller[actionName]) {
      controller[actionName] = blueprint[actionName];
    } else {
      // Overwritten blueprint action should be still available under
      // blueprint route, however with new callback function.
      overwrittenActions[actionName] = {
        route: blueprint[actionName].route,
        methods: blueprint[actionName].methods,
        fn: controller[actionName].fn
      };
    }
  }

  aggregateRoutes(controller, groupedRoutes);
  aggregateRoutes(overwrittenActions, groupedRoutes);

  for (var id in groupedRoutes) {
    var route = groupedRoutes[id]
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

function mountController(controllerRouter) {
  routes.use('/', controllerRouter);
}

_(models)
  .map(mountActions)
  .each(mountController);

module.exports = routes;


