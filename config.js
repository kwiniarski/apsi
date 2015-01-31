/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 *
 * Main configuration loader. This is the place where defaults are set
 * and all extending happens. Load order:
 * - command line arguments
 * - env variables
 * - .spiralrc file
 *
 * rc lib handles env and .rc file. Command line arguments are passed
 * from lib/core/cmd.js using global object.
 */

'use strict';

if (!global.args) {
  global.args = {};
}

var rc = require('rc')
  , join = require('path').join
  , config = {
      SPIRAL_DIR: __dirname,
      BASE_DIR: global.args.BASE_DIR || process.cwd(),
      PORT: global.args.PORT || 3000,
      ENV: process.env.NODE_ENV
  }
  , directories = {
      MODELS_DIR: 'api/models',
      MODELS_CONFIG: 'config/models',
      CONTROLLERS_DIR: 'api/controllers',
      CONTROLLERS_CONFIG: 'config/controllers',
      POLICIES_DIR: 'api/policies',
      POLICIES_CONFIG: 'config/policies',
      SERVICES_DIR: 'api/services',
      SERVICES_CONFIG_DIR: 'config/services',
      EVENTS_LOG_CONFIG: 'config/events-log',
      ACCESS_LOG_CONFIG: 'config/access-log',
      MIGRATIONS_DIR: 'migrations'
    };

for (var key in directories) {
  config[key] = join(config.BASE_DIR, directories[key]);
}

module.exports = rc('spiral', config);
