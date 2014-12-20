var path = require('path');
var chai = require('chai');
var utils = require('chai/lib/chai/utils');

utils.addMethod(chai.Assertion.prototype, 'path', function (str) {
  new chai.Assertion(this._obj).to.be.equal(str.replace(/\//g, path.sep));
});
