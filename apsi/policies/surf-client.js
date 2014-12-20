'use strict';

var passport = require('passport');
var util = require('util');


function SurfClientStrategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  if (!verify) {
    throw new Error('Surf Client authentication strategy requires a verify function');
  }

  passport.Strategy.call(this);

  this.name = 'apsi-client';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
  this._headerField = options.headerField || 'x-auth-id';
}

util.inherits(SurfClientStrategy, passport.Strategy);

SurfClientStrategy.prototype.authenticate = function(req) {

  var id = req.headers[this._headerField];
  if (!id) {
    return this.fail(new Error('Missing ID value'));
  }

  var self = this;

  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  if (self._passReqToCallback) {
    this._verify(req, id, verified);
  } else {
    this._verify(id, verified);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = SurfClientStrategy;
