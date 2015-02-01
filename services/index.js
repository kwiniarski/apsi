/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var path = require('path')
  , support = require('./../lib/support')
  , CONFIG = require('../config')
  , config = support.listFiles(CONFIG.SERVICES_CONFIG_DIR)
  , registry = support.listFiles(CONFIG.SERVICES_DIR)
  , services = Object.keys(registry)
  , serviceName
  , serviceConfig
  , Service;

function defineReadOnlyProperty(name, value) {
  Object.defineProperty(module.exports, name, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: value
  });
}

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
