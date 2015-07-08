/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var _ = require('lodash');
var debug = require('./log/debug')('spiral:controller');
var CONFIG = require('../config');
var support = require('./support');
var config = require(CONFIG.CONTROLLERS_CONFIG);
var controllers = support.loadModules(CONFIG.CONTROLLERS_DIR);

for (var ctrlName in controllers) {

  var controller = controllers[ctrlName];
  var controllerActions = require(controller.file);
  var controllerSettings = config[ctrlName] || {};

  controller.actions = {};

  for (var action in controllerActions) {
    var actionSettings = controllerSettings[action] || {};

    debug('"%s.%s": %s',
      ctrlName, action, JSON.stringify(actionSettings));

    controller.actions[action] = controllerActions[action];

    _.assign(controller.actions[action], {
      id: action,
      methods: actionSettings.methods,
      mountPath: actionSettings.mountPath
    });

  }

}

exports = module.exports = controllers;
