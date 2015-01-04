/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var path = require('path')
  , CONFIG = require('../config')
  , support = require('./support')
  , config = require(CONFIG.CONTROLLERS_CONFIG)
  , controllers = support.listFiles(CONFIG.CONTROLLERS_DIR)
  , blueprints = require('./blueprints');

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
      route: blueprints.routes[action] || actionSettings.route || '/' + parseActionName(action),
      fn: controller[action]
    };
  }

  controllers[ctrlName] = controller;

}

module.exports = controllers;
