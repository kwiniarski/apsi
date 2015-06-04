/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var support = require('../support')
  , actionWrapper = require('./action-wrapper')
  , RequestError = require('../errors').RequestError
  , _ = require('lodash')
  , httpMethods = _.map(require('http').METHODS, support.toLowerCase);
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

  if (!config.id || typeof config.id !== 'string' && config.id.length > 0) {
    throw new TypeError('ResourceAction(config.id) needs to be a non empty string');
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

//function responseStrategy(res, method) {
//  switch (method) {
//    case 'post': return res.created;
//    case 'get': return res.okOrNotFound;
//    case 'put': return res.createdOrNoContent;
//    case 'delete': return res.noContent;
//
//  }
//}
//
//function wrapAction(actionFn) {
//
//  if (actionFn.wrapped === true) {
//    return actionFn;
//  }
//
//  function wrappedAction(req, res, next) {
//    var result = actionFn(req, res, next);
//
//    if (res.headersSent === true) {
//      //eventsLog.error('Headers already send.');
//      return;
//    }
//
//    if (!result) {
//      return;
//    }
//
//    if (typeof result.then === 'function') {
//      var method = req.method.toLowerCase()
//        , success = responseStrategy(res, method);
//
//      return result
//        .then(success)
//        .catch(res.error);
//    } else {
//      //eventsLog.error('Action output is not a Promise instance.'
//      //  + ' Action should return Promise or undefined. If Promise is returned and response was send'
//      //  + ' within action function headers may be send twice.', {
//      //  method: req.method,
//      //  url: req.originalUrl || req.url
//      //});
//    }
//  }
//
//  wrappedAction.wrapped = true;
//  return wrappedAction;
//}

/**
 * ResourceAction represents single action for selected resource. For example
 * POST /resource/mount-path/action-path. Action must have handler function
 * (from blueprints or user defined, eventually 404 NotImplemented error handler).
 * Additionally ResourceAction may have policies registered.
 * @param handler
 * @constructor
 */
function ResourceAction(handler) {

  if (!handler || typeof handler !== 'function') {
    throw new TypeError('ResourceAction(handler) needs to be a function');
  }

  // TODO Do not copy handler properties. Instead create getter/setter for each possible property on prototype
  // (see mountPath) which will provide defaults unless handler provides custom values
  for (var key in handler) {
    if (handler[key]) {
      this[key] = handler[key];
    }
  }

  this.handler = handler;

  validateAction(this);
}

ResourceAction.prototype.policies = [];
ResourceAction.prototype.methods = ['GET'];

Object.defineProperty(ResourceAction.prototype, 'mountPath', {
  get: function () {
    //var isBlueprintAction = _.includes(['create', 'update', 'find', 'destroy'], this.handler.id);

    //if (_.includes(['create', 'update', 'find', 'destroy'], this.handler.id) === false) {
    //  return this.handler.mountPath || '/';
    //}
    if (!this.handler.mountPath) {
      return '/' + support.camelCaseToDash(this.handler.id);
    }
    return this.handler.mountPath || '/';
  },
  set: function () {}
});

/**
 * Adds methods to the provided router
 * @param router
 */
ResourceAction.prototype.setupRouter = function (router) {
  var allowedMethods = _.map(this.methods, support.toLowerCase)
    , notAllowedMethods = _.difference(httpMethods, allowedMethods);

  allowedMethods.forEach(function (method) {
    console.log('    ' + method + ' ' + this.mountPath);
    router[method](this.mountPath, this.policies, actionWrapper(this.handler));
  }.bind(this));

  //router.use('*', function (req, res, next) {
  //  console.log(allowedMethods, req.method.toLowerCase(), _.includes(allowedMethods, req.method.toLowerCase()));
  //  if (_.includes(allowedMethods, req.method.toLowerCase()) === false) {
  //    next(RequestError.MethodNotAllowed());
  //  }
  //  else {
  //    next();
  //  }
  //});

};

/**
 *
 * @param {Object} policies
 */
ResourceAction.prototype.registerPolicies = function (policies) {
  this.policies = this.policies.concat(policies);
};



module.exports = ResourceAction;
