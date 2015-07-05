var debug = require('debug')('spiral:policy');

function PolicyManager(registry, config) {
  this._registry = registry;
  this._config = config;
}

PolicyManager.WILDCARD = '*';



/**
 * Get policies for given resource or action in this resource
 * @param [resourceName]
 * @param [actionName]
 * @returns {*}
 */
PolicyManager.prototype.get = function (resourceName, actionName) {
  var policyMiddleware;
  var resource = this._config[resourceName]
    || this._config[PolicyManager.WILDCARD];
  var policies = (actionName && resource[actionName])
    ? resource[actionName]
    : resource[PolicyManager.WILDCARD] || resource;

  try {
    policyMiddleware = policies.map(function (policyName) {
      return this._registry.get(policyName);
    }.bind(this));
  }
  catch (error) {
    // TODO: Add reporting to error log when cannot get policies
    //console.log(policies, error);
    policyMiddleware = [];
  }

  debug('%s.%s: %s',
    resourceName || PolicyManager.WILDCARD,
    actionName || PolicyManager.WILDCARD,
    JSON.stringify(policies));

  return policyMiddleware;
};

exports = module.exports = PolicyManager;
