/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var ResourceAction = require('./action')
  , RequestError = require('../errors').RequestError
  , resourceActionBlueprint = require('./action-blueprint')
  , support = require('../support')
  , router = require('express').Router
  , _ = require('lodash')
  , httpMethods = _.map(require('http').METHODS, support.toLowerCase);

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

  // TODO use actions or mountPaths
  this.actions = {};
  this.mountPaths = {};

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
  var actionRouter = router()
    , allowedMethods = _(this.actions).pluck('methods').flatten().map(support.toLowerCase).value()
    , notAllowedMethods = _.difference(httpMethods, allowedMethods);

  console.log('  ' + this.mountPath, allowedMethods);
  for (var i in this.actions) {
    this.actions[i].setupRouter(actionRouter);
  }


  //actionRouter.all('*', function (req, res, next) {
  //  console.log(allowedMethods, req.method.toLowerCase(), _.includes(allowedMethods, req.method.toLowerCase()));
  //  if (_.includes(allowedMethods, req.method.toLowerCase()) === false) {
  //    next(RequestError.MethodNotAllowed());
  //  }
  //  else {
  //    next();
  //  }
  //});

  //return (router()).use(this.mountPath, function (req, res, next) {
  //  console.log(allowedMethods, req.method.toLowerCase(), _.includes(allowedMethods, req.method.toLowerCase()));
  //  if (_.includes(allowedMethods, req.method.toLowerCase()) === false) {
  //    next(RequestError.MethodNotAllowed);
  //  }
  //  else {
  //    next();
  //  }
  //}, this.policies, actionRouter);

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
    //if (!this.mountPaths[action.mountPath]) {
    //  this.mountPaths[action.mountPath] = {};
    //  for (var method in action.methods) {
    //    this.mountPaths[action.mountPath][method.toLowerCase()] = action;
    //  }
    //}
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
