/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var support = require('../support');

function validateTypeOfArrayRecords(array, name, type) {
  if (!array || !array instanceof Array) {
    throw new TypeError('ResourceAction(config.' + name + ') needs to be an Array');
  } else {
    for (var i = 0, j = array.length; i < j; i++) {
      if (typeof array[i] !== type) {
        throw new TypeError('ResourceAction(config.' + name + '[' + i + ']) needs to be a ' + type);
      }
    }
  }
}

function validateAction(config) {

  if (!config.name || typeof config.name !== 'string' && config.name.length > 0) {
    throw new TypeError('ResourceAction(config.name) needs to be a non empty string');
  }

  if (!config.handler || typeof config.handler !== 'function') {
    throw new TypeError('ResourceAction(config.handler) needs to be a function');
  }

  if (!config.mountPath) {
    throw new TypeError('ResourceAction(config.mountPath) is missing');
  } else {
    if (config.mountPath instanceof Array) {
      validateTypeOfArrayRecords(config.mountPath, 'mountPath', 'string');
    }
  }

  validateTypeOfArrayRecords(config.policies, 'policies', 'function');
  validateTypeOfArrayRecords(config.methods, 'methods', 'string');
}

/**
 * ResourceAction represents single action for selected resource. For example
 * POST /resource/mount-path/action-path. Action must have handler function
 * (from blueprints or user defined, eventually 404 NotImplemented error handler).
 * Additionally ResourceAction may have policies registered.
 * @param config
 * @constructor
 */
function ResourceAction(config) {

  if (!config || !support.isObject(config)) {
    throw new TypeError('ResourceAction(config) needs to be an object');
  }

  for (var key in config) {
    this[key] = config[key];
  }

  validateAction(this);
}

ResourceAction.prototype.mountPath = '/';
ResourceAction.prototype.policies = [];
ResourceAction.prototype.methods = ['GET'];

/**
 * Adds methods to the provided router
 * @param router
 */
ResourceAction.prototype.setupRouter = function (router) {
  this.methods.map(support.toLowerCase).forEach(function (method) {
    router[method](this.mountPath, this.policies, this.handler);
  }.bind(this));
};

/**
 * Add policy to the action
 * @param policy
 */
ResourceAction.prototype.registerPolicy = function (policy) {
  this.policies.push(policy);
};

module.exports = ResourceAction;
