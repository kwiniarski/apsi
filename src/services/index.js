'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var config = require('../../config');
var registry = {};
//var baseDir = __dirname;

//console.log(config);

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

function loadBundledServices() {
  return loadModulesFrom(config.APSI_SERVICES_DIR);
}

function loadUserServices() {
  return loadModulesFrom(path.join(config.BASE_DIR, 'api/services'));
}

function loadUserConfiguration() {
  return loadModulesFrom(path.join(config.BASE_DIR, 'config/services'));
}

//function requireService(name) {
//  var config = require(module.exports._config[name]);
//  var Service = require(module.exports._registry[name]);
//
//  return new Service(config);
//}
//
//function defineServices() {
//  var services = Object.keys(module.exports._registry);
//
//  services.forEach(function (service) {
//    module.exports[service] = requireService(service);
//  });
//}




Object.defineProperty(module.exports, '_registry', {
  enumerable: true,
  configurable: false,
  writable: false,
  value: _.merge(loadBundledServices(), loadUserServices())
});

Object.defineProperty(module.exports, '_config', {
  enumerable: true,
  configurable: false,
  writable: false,
  value: loadUserConfiguration()
});

//defineServices();
var services = Object.keys(module.exports._registry);
var serviceName, config, Service;

for (var i = 0, j = services.length; i < j; i++) {
  serviceName = services[i];
  config = module.exports._config[serviceName];

  if (config) {
    config = require(config);
  } else {
    config = null;
  }

  Service = require(module.exports._registry[serviceName]);

  module.exports[serviceName] = new Service(config);
}
