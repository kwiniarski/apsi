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

Object.defineProperties(policies, {
  _all: {
    value: [],
    enumerable: false,
    //configurable: true,
    writable: true
  }
});

/**
 * Returns policy module
 * @param policyName {String}
 * @returns {*}
 */
function getPolicy(policyName) {
  var policy = policyFiles[support.dashToCamelCase(policyName)];
  if (policy) {
    return policy;
  } else {
    throw new Error('Unknown policy "' + policyName + '". Known policies: ' + Object.keys(policyFiles));
  }
}

/**
 * Resolves map of policy names to the map of policy objects
 * @param policiesIds {Array|String}
 * @returns {Array}
 */
function getPolicies(policiesIds) {
  if (typeof policiesIds === 'string') {
    policiesIds = policiesIds.split(/[,\s]+/);
  }

  return policiesIds.map(getPolicy);
}

function Policy(config) {
  var _all = topLevelPolicies
    , _size = 0;

  if (config === false) {
    _all = false;
  }

  else if (config instanceof Array) {
    _all = getPolicies(config);
  }

  else if (config.hasOwnProperty(WILDCARD)) {
    _all = getPolicies(config[WILDCARD]);
  }

  for (var actionName in config) {
    if (actionName === WILDCARD) {
      continue;
    }
    this[actionName] = getPolicies(config[actionName]);
    _size++;
  }

  Object.defineProperties(this, {
    _size: {
      value: _size,
      enumerable: false
    },
    _all: {
      value: _all,
      enumerable: false
    }
  });
}

Policy.prototype.get = function(action) {
  return this.has(action) ? this[action] : this._all;
};

Policy.prototype.has = function(action) {
  return this[action] && !!this[action].length;
};

Policy.prototype.isRestricted = function() {
  return this._size === 0 && this._all === false;
};


for (var fileName in policyFiles) {
  policyFiles[fileName] = require(policyFiles[fileName]);
}

if (config[WILDCARD]) {
  topLevelPolicies = getPolicies(config[WILDCARD]);
  policies._all = new Policy(config[WILDCARD]);
}

for (var id in config) {
  if (id === WILDCARD) {
    continue;
  }
  policies[id] = new Policy(config[id]);
}

module.exports = policies;
