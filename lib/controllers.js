/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var _ = require('lodash')
  , CONFIG = require('../config')
  , support = require('./support')
  , models = require('./../models')
  , blueprints = require('./blueprints')
  , config = require(CONFIG.CONTROLLERS_CONFIG)
  , controllers = support.loadModules(CONFIG.CONTROLLERS_DIR)
  , eventsLog = require('./log/events')
  , replacedActions = {};




for (var ctrlName in controllers) {

  var controller = controllers[ctrlName]
    , controllerActions = require(controller.file)
    , controllerSettings = config[ctrlName] || {};

  controller.actions = {};

  for (var action in controllerActions) {
    var actionSettings = controllerSettings[action] || {};

    controller.actions[action] = {
      name: action,
      handler: controllerActions[action],
      methods: actionSettings.methods,
      policies: actionSettings.policies,
      mountPath: actionSettings.route
    };



  }

}


module.exports = controllers;
