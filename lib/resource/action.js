/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var support = require('../support')
  //, eventsLog = require('../log/events');

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

function responseStrategy(res, method) {
  switch (method) {
    case 'post': return res.created;
    case 'get': return res.okOrNotFound;
    case 'put': return res.createdOrNoContent;
    case 'delete': return res.noContent;

  }
}

function wrapAction(actionFn) {

  if (actionFn.wrapped === true) {
    return actionFn;
  }

  function wrappedAction(req, res, next) {
    var result = actionFn(req, res, next);

    if (res.headersSent === true) {
      //eventsLog.error('Headers already send.');
      return;
    }

    if (!result) {
      return;
    }

    if (typeof result.then === 'function') {
      var method = req.method.toLowerCase()
        , success = responseStrategy(res, method);

      return result
        .then(success)
        .catch(res.error);
    } else {
      //eventsLog.error('Action output is not a Promise instance.'
      //  + ' Action should return Promise or undefined. If Promise is returned and response was send'
      //  + ' within action function headers may be send twice.', {
      //  method: req.method,
      //  url: req.originalUrl || req.url
      //});
    }
  }

  wrappedAction.wrapped = true;
  return wrappedAction;
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
    if (config[key]) {
      this[key] = config[key];
    }
  }

  validateAction(this);
}

ResourceAction.wrapAction = wrapAction;

ResourceAction.prototype.mountPath = '/';
ResourceAction.prototype.policies = [];
ResourceAction.prototype.methods = ['GET'];

/**
 * Adds methods to the provided router
 * @param router
 */
ResourceAction.prototype.setupRouter = function (router) {
  this.methods.map(support.toLowerCase).forEach(function (method) {
    //console.log('    ' + method + ' ' + this.mountPath, ' ' + this.policies);
    router[method](this.mountPath, this.policies, wrapAction(this.handler));
  }.bind(this));
};

/**
 *
 * @param {Object} policies
 */
ResourceAction.prototype.registerPolicies = function (policies) {
  this.policies = this.policies.concat(policies);
};



module.exports = ResourceAction;
