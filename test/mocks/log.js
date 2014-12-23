'use strict';

var path = require('path');
var winston = require('winston');
var sinon = require('sinon');
var transportSpies = {};

module.exports.install = function () {
  var transportSpies = {};
  for (var transport in winston.transports) {
    transportSpies[transport] = sinon.spy(winston.transports[transport].prototype, 'log');
  }

  return transportSpies;
};

module.exports.uninstall = function () {
  for (var transport in transportSpies) {
    transportSpies[transport].reset();
  }
}

module.exports.emptyConfig = {
  'winston': winston,
  '../config': require('../fixtures/config'),
  '/app/config/log': {}
};

module.exports.config = {
  'winston': winston,
  '../config': require('../fixtures/config'),
  '/app/config/log': {
    Console: true,
    File: {
      stream: process.stdout
    }
  }
};

