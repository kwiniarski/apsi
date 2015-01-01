/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var fs = require('fs')
  , path = require('path')
  , lodash = require('lodash')
  , CONFIG = require('../config')
  , config = require(CONFIG.CONTROLLERS_CONFIG)
  , controllers = loadModulesFrom(CONFIG.CONTROLLERS_DIR)
  , blueprints = require('./blueprints');

function loadModulesFrom(dir) {
  try {
    var files = fs.readdirSync(dir);
    var modules = lodash.map(files, function (file) {
      return path.join(dir, file);
    });

    return lodash.zipObject(files, modules);
  }
  catch (err) {
    throw 'Cannot read services from ' + dir + err;
  }
}

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
