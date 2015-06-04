/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var CONFIG = require('../config')
  , support = require('./support')
  , config = require(CONFIG.CONTROLLERS_CONFIG)
  , controllers = support.loadModules(CONFIG.CONTROLLERS_DIR)
  //, actionWrapper = require('./resource/action-wrapper')
  , eventsLog = require('./log/events');

function extend(fn, object) {
  for (var i in object) {
    fn[i] = object[i];
  }
}


for (var ctrlName in controllers) {

  var controller = controllers[ctrlName]
    , controllerActions = require(controller.file)
    , controllerSettings = config[ctrlName] || {};

  controller.actions = {};

  for (var action in controllerActions) {
    var actionSettings = controllerSettings[action] || {};

    // TODO Add debug information when controller action is loaded
    //console.log('+ ' + ctrlName + '.' + action, actionSettings);
    controller.actions[action] = controllerActions[action];

    extend(controller.actions[action], {
      id: action,
      methods: actionSettings.methods,
      mountPath: actionSettings.mountPath
    });

  }

}


module.exports = controllers;
