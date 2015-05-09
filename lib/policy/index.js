var config = require('../../config')
  , PolicyConfig = require('./config')
  , PolicyRegistry = require('./registry')
  , PolicyManager = require('./manager')

  , policyConfig = new PolicyConfig(config.POLICIES_CONFIG)
  , policyRegistry = new PolicyRegistry({
    dir: config.POLICIES_DIR
  });

exports = module.exports = new PolicyManager(policyRegistry, policyConfig);

