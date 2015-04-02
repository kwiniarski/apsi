/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var ResourceAction = require('./action')
  , ResourceActionBlueprint = require('./action-blueprint')
  , router = require('express').Router;

/**
 * Resolves mount path from model or controller object.
 * @param model
 * @param controller
 * @returns {*}
 */
function resolveMountPath(model, controller) {
  var mountPath = null;
  if (controller) {
    mountPath = controller.path;
  }
  if (model) {
    if (mountPath === null) {
      mountPath = model.path;
    }
    if (mountPath !== model.path) {
      throw new Error('Mount path for model and controller do not match');
    }
  }
  return mountPath;
}

function ResourceBase(model, controller, policies) {

  var blueprint = {};

  this._actions = {};
  this._policies = [];
  this._mountPath = resolveMountPath(model, controller);

  if (this._mountPath === null) {
    throw new Error('Cannot initialize resource without mount path');
  }

  if (model) {
    blueprint = new ResourceActionBlueprint(model);
  }

  this
    .registerActions(blueprint)
    .registerActions(controller);

  this.registerPolicies(policies);
}

ResourceBase.prototype = Object.create(router());

/**
 * Configure and return ResourceBase instance as a Router.
 * @returns {Router} Express Router object
 */
ResourceBase.prototype.getRouter = function () {
  var actionRouter = router();

  this._actions.forEach(function (action) {
    action.setupRouter(actionRouter);
  });

  return (router()).use(this._mountPath, this._policies, actionRouter);
};

/**
 * Registers actions from given source
 * @param collection
 * @returns {ResourceBase}
 */
ResourceBase.prototype.registerActions = function (collection) {
  for (var actionName in collection) {
    this.registerAction(collection[actionName]);
  }
  return this;
};

/**
 * Registers single action
 * @param factory
 */
ResourceBase.prototype.registerAction = function (factory) {
  try {
    var action = new ResourceAction(factory);
    this._actions[action.name] = action;
  } catch (error) {
    console.log(error);
    // TODO: decide how to handle startup errors
  }

};

ResourceBase.prototype.getAction = function (actionName) {
  return this._actions[actionName] || null;
};

ResourceBase.prototype.registerPolicies = function (policies) {
  //this._policies = policies.get(this.name);
  //this._actions.forEach(function (action) {
  //  action.registerPolicies(policies.get(this.name, action.name));
  //}.bind(this));
};

ResourceBase.prototype.registerPolicy = function (policy, actions) {
  if (actions && actions instanceof Array) {
    actions.forEach(function (actionName) {
      this._actions[actionName].registerPolicy(policy);
    }.bind(this));
  } else {
    this._policies.push(policy);
  }
};

module.exports = ResourceBase;
