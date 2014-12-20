var vm = require('vm');
var fs = require('fs');
var path = require('path');

function extend(base, extender) {
  if (!extender) {
    return base;
  }

  for (var i in extender) {
    if (extender.hasOwnProperty(i)) {
      base[i] = extender[i];
    }
  }

  return base;
}
/**
 * Helper for unit testing:
 * - load module with mocked dependencies
 * - allow accessing private state of the module
 *
 * @param {string} filePath Absolute path to module (file to load)
 * @param {Object=} mocks Hash of mocked dependencies
 */
exports.module = function(filePath, mocks, ctx) {
  mocks = mocks || {};

  // this is necessary to allow relative path modules within loaded file
  // i.e. requiring ./some inside file /a/b.js needs to be resolved to /a/some
  var resolveModule = function(module) {
    if (module.charAt(0) !== '.') return module;
    return path.resolve(path.dirname(filePath), module);
  };

  //var pathFix = new RegExp(path.sep.replace('\\','\\\\'), 'g');
  var exports = {};
  var context = extend({
    require: function(name) {
      try {
        var nameFixed = name.replace(/\\/g, '/');
        if (mocks[nameFixed]) {
          //console.log("\n"+'Fetching %s module ... using mock', name);
          return mocks[nameFixed];
        } else {
          //console.log("\n"+'Fetching %s module ... using require', name);
          return require(resolveModule(name));
        }
      }
      catch (err) {
        //console.log("\n"+'Cannot fetch %s module', name);
        return {};
      }
    },
    process: process,
    console: console,
    exports: exports,
    module: {
      exports: exports
    }
  }, ctx);

  var file = fs.readFileSync(filePath);

  try {
    vm.runInNewContext(file, context);

  }
  catch (err) {
    console.log(err);
  }

  return exports;

};
