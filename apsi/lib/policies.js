'use strict';
/**
 * Module for loading and configuring build into Surf policies.
 * This module uses Passport.
 * It should expose API to register additional Passport strategies
 * and use them in routes as auth middleware.
 * @type {exports}
 */

var passport = require('passport');
var SurfClientStrategy = require('./../policies/apsi-client');



module.exports = {

  passport: passport,

  register: function (services) {

    passport.use(new SurfClientStrategy(function (id, done) {

      if (!id) {
        return done(null, false);
      }

      services.db.user.find({
        where: {
          apiId: id,
          active: true
        }
      }).success(function (user) {
        if (!user) {
          done(null, false);
        } else {
          done(null, user);
        }
      });

      //if (!configs || !configs[apiKey]) {
      //  return done(null, false);
      //}

      //req.client = configs[apiKey];

      //return done(null, {});
    }));
  }
};
