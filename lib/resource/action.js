/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var support = require('../support');
var actionWrapper = require('./action-wrapper');
var actionBlueprint = require('./action-blueprint');
var blueprintedActions = Object.keys(actionBlueprint.defaults);

function validateTypeOfArrayRecords(array, name, type) {
  if (!array || !array instanceof Array) {
    throw new TypeError('ResourceAction(config.' + name
      + ') needs to be an Array');
  }
  else {
    for (var i = 0, j = array.length; i < j; i++) {
      if (typeof array[i] !== type) {
        throw new TypeError('ResourceAction(config.' + name + '[' + i
          + ']) needs to be a ' + type);
      }
    }
  }
}

function validateAction(config) {

  if (!config.id || typeof config.id !== 'string' && config.id.length > 0) {
    throw new TypeError('ResourceAction(config.id) needs to be ' +
      'a non empty string');
  }

  if (!config.handler || typeof config.handler !== 'function') {
    throw new TypeError('ResourceAction(config.handler) needs to be' +
      ' a function');
  }

  if (!config.mountPath) {
    throw new TypeError('ResourceAction(config.mountPath) is missing');
  }
  else {
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
 * (from blueprints or user defined, eventually 404 NotImplemented error
 * handler).Additionally ResourceAction may have policies registered.
 * @param handler
 * @constructor
 */
function ResourceAction(handler) {

  if (!handler || typeof handler !== 'function') {
    throw new TypeError('ResourceAction(handler) needs to be a function');
  }

  for (var key in handler) {
    if (handler[key]) {
      this[key] = handler[key];
    }
  }

  if (!this.mountPath) {
    if (blueprintedActions.indexOf(this.id) !== -1) {
      this.mountPath = actionBlueprint.defaults[this.id].mountPath;
    }
    else {
      this.mountPath = '/' + support.camelCaseToDash(this.id);
    }
  }

  this.handler = actionWrapper(handler);

  validateAction(this);
}

ResourceAction.prototype.policies = [];
ResourceAction.prototype.methods = ['GET'];

/**
 *
 * @param {Object} policies
 */
ResourceAction.prototype.registerPolicies = function (policies) {
  this.policies = this.policies.concat(policies);
};



module.exports = ResourceAction;
