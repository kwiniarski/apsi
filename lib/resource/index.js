/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var ResourceAction = require('./action')
  , resourceActionBlueprint = require('./action-blueprint')
  , router = require('express').Router;

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
      throw new Error('Mount path for model ("' + model.path + '") and controller ("' + controller.path + '") do not match');
    }
  }

  if (mountPath && mountPath.indexOf('/') !== 0) {
    mountPath = '/' + mountPath;
  }

  return mountPath;
}

function Resource(model, controller, policies) {

  var blueprint = {}
    , actions = controller ? controller.actions : null;

  this.id = controller ? controller.name : (model ? model.name : null);
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

/**
 * Configure and return Resource instance as a Router.
 * @returns {Router} Express Router object
 */
Resource.prototype.getRouter = function () {
  var actionRouter = router();
  //console.log('  ' + this.mountPath);
  for (var i in this.actions) {
    this.actions[i].setupRouter(actionRouter);
  }

  return (router()).use(this.mountPath, this.policies, actionRouter);
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
    this.actions[action.id] = action;
  } catch (error) {
    //console.log(error, factory);
    // TODO: decide how to handle startup errors
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
