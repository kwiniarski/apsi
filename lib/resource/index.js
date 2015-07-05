/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var ResourceAction = require('./action');
var RequestError = require('../errors').RequestError;
var resourceActionBlueprint = require('./action-blueprint');
var support = require('../support');
var router = require('express').Router;
var _ = require('lodash');
var debug = require('debug')('spiral:action');


/**
 * Resolves mount path from model or controller object.
 * @param model
 * @param controller
 * @returns {*}
 */
function resolveMountPath(model, controller) {
  var mountPath = null;
  if (controller && controller.path) {
    mountPath = controller.path;
  }
  if (model) {
    if (mountPath === null) {
      mountPath = model.path;
    }
    if (mountPath !== model.path) {
      throw new Error('Mount path for model ("' + model.path
        + '") and controller ("' + controller.path + '") do not match');
    }
  }

  if (mountPath && mountPath.indexOf('/') !== 0) {
    mountPath = '/' + mountPath;
  }

  return mountPath;
}

function Resource(model, controller, policies) {

  var blueprint = {};
  var actions = controller ? controller.actions : null;

  this.id = controller ? controller.name : (model ? model.name : null);

  this.replaced = {};
  this.actions = {};
  this.policies = [];
  this.mountPath = resolveMountPath(model, controller);

  if (this.mountPath === null) {
    throw new Error('Cannot initialize resource without mount path');
  }

  if (model) {
    blueprint = resourceActionBlueprint(model, this.mountPath);
  }

  this
    .registerActions(blueprint)
    .registerActions(actions);

  if (policies) {
    this.registerPolicies(policies);
  }
}

Resource.prototype = Object.create(router());

Resource.prototype.agregateActions = function (actions) {
  var mountPaths = {};

  for (var i in actions) {
    var action = actions[i];
    var mountPath = action.mountPath;

    if (mountPath instanceof Array === false) {
      mountPath = [mountPath];
    }

    for (var m = 0; m < mountPath.length; m++) {
      if (!mountPaths[mountPath[m]]) {
        mountPaths[mountPath[m]] = {
          mountPath: mountPath[m],
          methods: {}
        };
      }

      for (var n = 0, method; !!(method = action.methods[n]); n++) {
        mountPaths[mountPath[m]].methods[method] = action;
      }
    }
  }

  return mountPaths;
};

function respondWithMethodNotAllowedStatus(req, res, next) {
  next(RequestError.MethodNotAllowed());
}

function respondWithNotFoundStatus(req, res, next) {
  next(RequestError.NotFound('Action not defined'));
}

/**
 * Configure and return Resource instance as a Router.
 * @returns {Object} Express Router object
 */
Resource.prototype.getRouter = function () {
  var resourceRouter = router();
  var actions = this.agregateActions(this.actions);
  var replaced = this.agregateActions(this.replaced);

  for (var mountPathId in actions) {
    var mountPath = actions[mountPathId].mountPath;
    var actionRouter = resourceRouter.route(mountPath);
    var method, action;

    for (method in actions[mountPathId].methods) {
      action = actions[mountPathId].methods[method];

      debug('%s %s%s<%s>: %s()',
        _.padLeft(method, 6),
        this.mountPath, mountPath, typeof mountPath,
        action.id);

      actionRouter[method.toLowerCase()](action.policies, action.handler);
    }

    if (replaced[mountPathId]) {
      for (method in replaced[mountPathId].methods) {
        action = replaced[mountPathId].methods[method];

        debug('%s %s%s<%s>: %s() -> RequestError.NotFound()',
          _.padLeft(method, 6),
          this.mountPath, mountPath, typeof mountPath,
          action.id);

        actionRouter[method.toLowerCase()](respondWithNotFoundStatus);
      }
    }

    actionRouter.all(respondWithMethodNotAllowedStatus);
  }

  return (router()).use(this.mountPath, this.policies, resourceRouter);
};

/**
 * Registers actions from given source
 * @param collection
 * @returns {Resource}
 */
Resource.prototype.registerActions = function (collection) {
  for (var actionName in collection) {
    this.registerAction(collection[actionName]);
  }
  return this;
};

/**
 * Registers single action
 * @param factory
 */
Resource.prototype.registerAction = function (factory) {
  try {
    var action = new ResourceAction(factory);

    if (this.actions[action.id]) {
      this.replaced[action.id] = this.actions[action.id];
    }

    this.actions[action.id] = action;
  }
  catch (error) {
    console.log(error, factory);
    // TODO decide how to handle startup errors
  }
};

Resource.prototype.getAction = function (actionName) {
  return this.actions[actionName] || null;
};

Resource.prototype.registerPolicies = function (policies) {
  this.policies = policies.get(this.id);

  for (var actionName in this.actions) {
    var action = this.actions[actionName];
    action.registerPolicies(policies.get(this.id, action.id));
  }
};

exports = module.exports = Resource;
