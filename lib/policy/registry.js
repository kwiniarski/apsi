var support = require('../support');

function PolicyRegistry(config) {
  if (!config.dir) {
    throw new ReferenceError('Missing "dir" option');
  }

  this._registry = {};
  // TODO: allow/block policy middleware is not configurable?
  this._allow = config.allowMiddleware;
  this._block = config.blockMiddleware;

  this.add(support.loadModules(config.dir));
}

PolicyRegistry.ALLOW_MIDDLEWARE_FLAG = true;
PolicyRegistry.BLOCK_MIDDLEWARE_FLAG = false;

PolicyRegistry.prototype.add = function (modules) {
  for (var i in modules) {
    this.set(modules[i].name, modules[i].file);
  }
};

PolicyRegistry.prototype.set = function (name, file) {
  this._registry[name] = support.require(file);
};

PolicyRegistry.prototype.get = function (name) {
  if (name === PolicyRegistry.ALLOW_MIDDLEWARE_FLAG) {
    return this.allow();
  }

  if (name === PolicyRegistry.BLOCK_MIDDLEWARE_FLAG) {
    return this.block();
  }

  if (this._registry.hasOwnProperty(name)) {
    return this._registry[name];
  }

  throw new ReferenceError('Cannot find "' + name + '" policy in registry');
};

PolicyRegistry.prototype.allow = function () {
  if (this._allow) {
    return this._allow;
  }
  else {
    throw new Error('Allow policy/middleware is not configured');
  }
};

PolicyRegistry.prototype.block = function () {
  if (this._block) {
    return this._block;
  }
  else {
    throw new Error('Block policy/middleware is not configured');
  }
};

exports = module.exports = PolicyRegistry;
