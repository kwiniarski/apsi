var config = require('../../config');
var PolicyConfig = require('./config');
var PolicyRegistry = require('./registry');
var PolicyManager = require('./manager');
var RequestError = require('../errors').RequestError;

var policyConfig = new PolicyConfig(config.POLICIES_CONFIG)
// TODO Policies are not configurable (allow|block) middleware
var policyRegistry = new PolicyRegistry({
  dir: config.POLICIES_DIR,
  allowMiddleware: function (req, res, next) {
    next();
  },
  blockMiddleware: function (req, res, next) {
    next(RequestError.NotFound());
  }
});

exports = module.exports = new PolicyManager(policyRegistry, policyConfig);

