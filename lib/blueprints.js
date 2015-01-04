/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var RequestError = require('./errors').RequestError;
var blueprints = {};

blueprints.routes = {
  find: /^\/(\d+)$/,
  findAll: /^\/$/,
  create: /^\/$/,
  update: /^\/(\d+)$/,
  destroy: /^\/(\d+)$/
};

blueprints.RESERVED_METHODS = Object.keys(blueprints.routes);

blueprints.getDefaultActions = function (model, modelName) {

  var mountPath = '/' + modelName
    , location = function (id) {
        return mountPath + '/' + id;
      };

  return {

    // Create
    create: {
      methods: ['post'],
      route: blueprints.routes.create,
      fn: function (req, res, next) {
        model
          .create(req.body)
          .done(function (err, data) {
            if (err) {
              return next(RequestError.BadRequest(err));
            }
            return res.created(location(data.id));
          });
      }
    },

    // Create or Update (Modify)
    update: {
      methods: ['put'],
      route: blueprints.routes.update,
      fn: function (req, res, next) {
        var id = req.body.id = req.params[0];
        model
          .upsert(req.body)
          .done(function (err, status) {
            if (err) {
              return next(RequestError.BadRequest(err));
            }
            // status - true if inserted, false for updated. Always undefined in SQLite.
            return status === true
              ? res.created(location(id))
              : res.noContent();
          });
      }
    },

    // Read (Retrieve)
    find: {
      methods: ['get'],
      route: blueprints.routes.find,
      fn: function (req, res, next) {
        var id = req.params[0];

        model
          .find(id)
          .done(function (err, data) {
            if (err) {
              return next(RequestError.BadRequest(err));
            }
            return data === null
              ? next(RequestError.NotFound())
              : res.ok(data);
          });
      }
    },

    findAll: {
      methods: ['get'],
      route: blueprints.routes.findAll,
      fn: function (req, res, next) {
        model
          .findAll()
          .done(function (err, data) {
            if (err) {
              return next(RequestError.BadRequest(err));
            }
            return data === null
              ? next(RequestError.NotFound())
              : res.ok(data);
          });
      }
    },

    // Delete (Destroy)
    destroy: {
      methods: ['delete'],
      route: blueprints.routes.destroy,
      fn: function (req, res, next) {
        model
          .destroy({ where: { id: req.params[0] } })
          .done(function (err) {
            if (err) {
              return next(RequestError.BadRequest(err));
            }
            return res.noContent();
          });
      }
    }

  };

};

module.exports = blueprints;
