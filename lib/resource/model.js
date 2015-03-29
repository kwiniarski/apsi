/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var ResourceAction = require('./action');
var ResourceGenericActions = require('./generic-actions');
var router = require('express').Router;

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

function ResourceModel(model, controller, policies) {

  this._actions = {};
  this._policies = [];
  this._mountPath = resolveMountPath(model, controller);

  if (this._mountPath === null) {
    throw new Error('Cannot initialize resource without mount path');
  }

  var genericActions = {};

  if (model) {
    genericActions = new ResourceGenericActions(model);
  }

  this
    .registerActions(genericActions)
    .registerActions(controller);
}

ResourceModel.prototype = Object.create(router());

/**
 * Configure and return ResourceModel instance as a Router.
 * @returns {Router} Express Router object
 */
ResourceModel.prototype.getRouter = function () {
  var actionRouter = router();

  this._actions.forEach(function (action) {
    action.setupRouter(actionRouter);
  });

  return (router()).use(this._mountPath, this._policies, actionRouter);
};

ResourceModel.prototype.registerActions = function (collection) {
  for (var actionName in collection) {
    this.registerAction(collection[actionName]);
  }
  return this;
};

ResourceModel.prototype.registerAction = function (factory) {
  try {
    var action = new ResourceAction(factory);
    this._actions[action.name] = action;
  } catch (error) {
    console.log(error);
    // TODO: decide how to handle startup errors
  }

};

ResourceModel.prototype.getAction = function (actionName) {
  return this._actions[actionName] || null;
};

ResourceModel.prototype.registerPolicies = function (policies) {

};

ResourceModel.prototype.registerPolicy = function (policy, actions) {
  if (actions && actions instanceof Array) {
    actions.forEach(function (actionName) {
      this._actions[actionName].registerPolicy(policy);
    }.bind(this));
  } else {
    this._policies.push(policy);
  }
};

module.exports = ResourceModel;
