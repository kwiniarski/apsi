/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var CONFIG = require('../config')
  , WILDCARD = '*'
  , support = require('./support')
  , config = require(CONFIG.POLICIES_CONFIG)
  , policyFiles = support.listFiles(CONFIG.POLICIES_DIR)
  , topLevelPolicies = []
  , policies = {};

function getPolicy(policyName) {
  var policy = policyFiles[support.dashToCamelCase(policyName)];
  if (policy) {
    return policy;
  } else {
    throw new Error('Unknown policy "' + policyName + '". Known policies: ' + Object.keys(policyFiles));
  }
}

function getPolicies(policiesIds) {
  if (typeof policiesIds === 'string') {
    policiesIds = policiesIds.split(/[,\s]+/);
  }

  return policiesIds.map(getPolicy);
}

function Policy(config) {
  Object.defineProperty(this, '_all', {
    value: config[WILDCARD]
      ? getPolicies(config[WILDCARD])
      : topLevelPolicies,
    enumerable: false
  });

  for (var actionName in config) {
    if (actionName === WILDCARD) {
      continue;
    }
    this[actionName] = getPolicies(config[actionName]);
  }
}

Policy.prototype.get = function(action) {
  return this.has(action) ? this[action] : this._all;
};

Policy.prototype.has = function(action) {
  return this[action] && !!this[action].length;
};


for (var fileName in policyFiles) {
  policyFiles[fileName] = require(policyFiles[fileName]);
}

if (config[WILDCARD]) {
  topLevelPolicies = getPolicies(config[WILDCARD]);
}

for (var id in config) {
  if (id === WILDCARD) {
    continue;
  }
  policies[id] = new Policy(config[id]);
}

module.exports = policies;
