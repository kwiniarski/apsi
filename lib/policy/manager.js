
function PolicyManager(registry, config) {
  this._registry = registry;
  this._config = config;
}

PolicyManager.WILDCARD = '*';

PolicyManager.prototype.get = function (resourceName, actionName) {
  var resource = this._config[resourceName] || this._config[PolicyManager.WILDCARD];
  var policies = (actionName && resource[actionName])
    ? resource[actionName]
    : resource[PolicyManager.WILDCARD] || resource;

  try {
    return policies.map(function (policyName) {
      return this._registry.get(policyName);
    }.bind(this));
  }
  catch (error) {
    // TODO: Add reporting to error log when cannot get policies
    //console.log(policies, error);
    return [];
  }
};

exports = module.exports = PolicyManager;
