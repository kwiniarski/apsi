/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var spiral = require('../../../../index');
var RequestError = require('../../../../lib/errors').RequestError;
var _ = require('lodash');

module.exports = {
  find: function (req, res, next) {
    spiral.models.users.find({
      where: {
        email: req.params[0]
      }
    }).done(function (err, data) {
      if (err) {
        return next(RequestError.BadRequest(err));
      }
      if (_.isEmpty(data)) {
        return next(RequestError.NotFound());
      }
      return res.ok(data);
    });
  },
  listAvatarImages: function (req, res) {
    spiral.models.users.findAll({
      attributes: ['avatar']
    }).then(res.ok);
  },
  addAvatarImage: function (req, res) {
    var id = req.body.id;
    spiral.models.users.update({
      avatar: req.body.image
    }, {
      where: {
        id: id
      }
    }).then(function(){
      return spiral.models.users.find(id);
    }).then(res.ok);
  }
};
