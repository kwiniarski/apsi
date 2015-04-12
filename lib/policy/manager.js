
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

  return policies.map(function (policyName) {
    return this._registry.get(policyName);
  }.bind(this));
};

exports = module.exports = PolicyManager;
