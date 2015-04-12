var support = require('../support');
var PolicyRegistry = require('./registry');

function normalizeValues(value) {
  return (typeof value === 'string')
    ? support.dashToCamelCase(value)
    : value;
}

function readConfig(config) {
  return (support.isObject(config))
    ? config
    : support.readJsonSync(config);
}

function PolicyConfig(configData) {
  var config = readConfig(configData);

  for (var key in config) {
    var record = config[key];

    if (support.isObject(record)) {
      this[key] = new PolicyConfig(record);
      continue;
    }

    if (typeof record === 'string') {
      record = support.stringToArray(record);
    }

    if (typeof record === 'boolean') {
      record = [record];
    }

    if (record instanceof Array) {
      record = record.map(normalizeValues);
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
