var support = require('../support')
  , _ = require('lodash')
  , PolicyRegistry = require('./registry');

function normalizeValues(value) {
  return (_.isString(value))
    ? support.stringToArray(value).map(_.camelCase)
    : value;
}

function readConfig(config) {
  try {
    return (support.isObject(config))
      ? config
      : support.require(config);
  } catch (error) {
    throw new Error('Cannot read policy config: "' + config + '"');
  }
}

function PolicyConfig(configData) {
  var config = readConfig(configData);

  for (var key in config) {
    var record = config[key];

    if (_.isPlainObject(record)) {
      this[key] = new PolicyConfig(record);
      continue;
    }

    if (_.isString(record)) {
      record = support.stringToArray(record);
    }

    if (_.isBoolean(record)) {
      record = [record];
    }

    if (_.isArray(record)) {
      record = _(record)
        .map(normalizeValues)
        .flatten()
        .value();
    }

    if (record.length > 1) {
      if (record.indexOf(PolicyRegistry.ALLOW_MIDDLEWARE_FLAG) >= 0
        || record.indexOf(PolicyRegistry.BLOCK_MIDDLEWARE_FLAG) >= 0) {
        throw new Error('Block/Allow policy cannot be used together with custom policies.');
      }
    }

    this[key] = record;
  }
}

exports = module.exports = PolicyConfig;
