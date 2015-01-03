'use strict';
var fs = require('fs-extra');

module.exports = {
  loadFiles: function loadFiles(dir) {
    return fs.readdirSync(dir);
  }
};
