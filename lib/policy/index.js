var config = require('../../config')
  , PolicyConfig = require('./config')
  , PolicyRegistry = require('./registry')
  , PolicyManager = require('./manager')
  , RequestError = require('../errors').RequestError

  , policyConfig = new PolicyConfig(config.POLICIES_CONFIG)
  // TODO Policies are not configurable (allow|block) middleware
  , policyRegistry = new PolicyRegistry({
    dir: config.POLICIES_DIR,
    allowMiddleware: function(req, res, next) {
      next();
    },
    blockMiddleware: function(req, res, next) {
      next(RequestError.NotFound());
    }
  });

exports = module.exports = new PolicyManager(policyRegistry, policyConfig);

