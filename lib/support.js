'use strict';
var _ = require('lodash')
  , fs = require('fs-extra')
  , path = require('path');

module.exports = {
  loadFiles: function loadFiles(dir) {
    return fs.readdirSync(dir);
  },
  listFiles: function listFiles(dir) {
    try {
      var files = fs.readdirSync(dir);
      var modules = _.map(files, function (file) {
        return path.join(dir, file);
      });

      return _.zipObject(files, modules);
    }
    catch (err) {
      throw 'Cannot read files from ' + dir + err;
    }
  }
};
