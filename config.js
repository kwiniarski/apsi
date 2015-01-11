/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var rc = require('rc')
  , join = require('path').join
  , config = {
      SURF_DIR: __dirname,
      BASE_DIR: global.BASE_DIR || process.cwd(),
      PORT: global.PORT || 3000
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
      ACCESS_LOG_CONFIG: 'config/access-log'
    };

for (var key in directories) {
  config[key] = join(config.BASE_DIR, directories[key]);
}

module.exports = rc('surf', config);
