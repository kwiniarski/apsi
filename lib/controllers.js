/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var CONFIG = require('../config')
  , support = require('./support')
  , models = require('./../models')
  , blueprints = require('./blueprints')
  , config = require(CONFIG.CONTROLLERS_CONFIG)
  , controllers = support.listFiles(CONFIG.CONTROLLERS_DIR)
  , eventsLog = require('./log/events')
  , replacedActions = {};

function parseActionName(name) {
  return name.replace(/\B[A-Z]/g, function(match){
    return '-' + match;
  }).toLowerCase();
}

function toLowerCase(str) {
  return str.toLowerCase();
}

for (var ctrlName in controllers) {

  var controller = require(controllers[ctrlName])
    , settings = config[ctrlName] || {}
    , action
    , actionSettings;

  for (action in controller) {
    actionSettings = settings[action] || {};
    controller[action] = {
      methods: (actionSettings.methods || ['get']).map(toLowerCase),
      route: actionSettings.route || blueprints.routes[action] || '/' + parseActionName(action),
      fn: controller[action]
    };
  }

  controllers[ctrlName] = controller;
  eventsLog.debug('controller initialized', ctrlName);
}

for (var modelName in models) {

  replacedActions[modelName] = {};

  if (!controllers[modelName]) {
    controllers[modelName] = {};
  }

  var model = models[modelName]
    , controller = controllers[modelName]
    , actionName
    , blueprint = blueprints.getDefaultActions(model, modelName);

  for (actionName in blueprint) {
    if (!controller[actionName]) {
      controller[actionName] = blueprint[actionName];
    } else {
      // Overwritten blueprint action should be still available under
      // blueprint route, however with new callback function.
      replacedActions[modelName][actionName] = {
        route: blueprint[actionName].route,
        methods: blueprint[actionName].methods,
        fn: controller[actionName].fn
      };
    }
  }
}

module.exports = controllers;

Object.defineProperty(module.exports, '_replaced', {
  value: replacedActions,
  enumerable: false
});
