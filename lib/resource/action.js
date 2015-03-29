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

function validateActionConfig(config) {
  if (!config || !support.isObject(config)) {
    throw new TypeError('ResourceAction(config) needs to be an object');
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
 * @param options
 * @constructor
 */
function ResourceAction(options) {

  validateActionConfig(options);

  this._handler = options.handler;
  this._mountPath = options.mountPath;
  this._methods = options.methods;
  this._policies = [];

  this.name = options.name;
}

ResourceAction.prototype.setupRouter = function (router) {
  this._methods.map(support.toLowerCase).forEach(function (method) {
    router[method](this._mountPath, this._policies, this._handler);
  }.bind(this));
};

ResourceAction.prototype.registerPolicy = function (policy) {
  this._policies.push(policy);
};

module.exports = ResourceAction;
