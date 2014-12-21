/**
 * Service provider
 */

'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var CONFIG = require('../../config');
var config;
var registry;
var services;
var serviceName;
var serviceConfig;
var Service;

function loadModulesFrom(dir) {
  try {
    var files = fs.readdirSync(dir);
    var modules = _.map(files, function (file) {
      return path.join(dir, file);
    });

    return _.zipObject(files, modules);
  }
  catch (err) {
    throw 'Cannot read services from ' + dir + err;
  }
}

function defineReadOnlyProperty(name, value) {
  Object.defineProperty(module.exports, name, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: value
  });
}

config = loadModulesFrom(CONFIG.APPLICATION_SERVICES_CONFIG_DIR);
registry =  _.merge(loadModulesFrom(CONFIG.APSI_SERVICES_DIR), loadModulesFrom(CONFIG.APPLICATION_SERVICES_DIR));
services = Object.keys(registry);

for (var i = 0, j = services.length; i < j; i++) {
  serviceName = services[i];
  serviceConfig = config[serviceName];

  if (serviceConfig) {
    serviceConfig = require(serviceConfig);
  } else {
    serviceConfig = null;
  }

  Service = require(registry[serviceName]);

  defineReadOnlyProperty(serviceName, new Service(serviceConfig));
}

defineReadOnlyProperty('_registry', registry);
defineReadOnlyProperty('_config', config);
