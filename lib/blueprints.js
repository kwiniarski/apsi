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

blueprints.CRUD_METHODS = Object.keys(blueprints.routes);

blueprints.getDefaultActions = function (model, modelName) {

  var mountPath = '/' + modelName;

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
            } else {
              res.created(data, mountPath + '/' + data.id);
            }
          });
      }
    },

    // Create or Update (Modify)
    update: {
      methods: ['put'],
      route: blueprints.routes.update,
      fn: function (req, res) {
        var id = req.body.id = req.params[0];
        model
          .upsert(req.body)
          .then(function (status) {
            // status - true if inserted, false for updated.
            // Always undefined in SQLite.
            model
              .find(id)
              .then(function (data) {
                if (status === true) {
                  res.created(data, mountPath + '/' + id);
                } else {
                  res.ok(data);
                }
              });

          });
      }
    },

    // Read (Retrieve)
    find: {
      methods: ['get'],
      route: blueprints.routes.find,
      fn: function (req, res) {
        var id = req.params[0];

        model
          .find(id)
          .then(res.ok);
      }
    },

    findAll: {
      methods: ['get'],
      route: blueprints.routes.findAll,
      fn: function (req, res) {
        model
          .findAll()
          .then(res.ok);
      }
    },

    // Delete (Destroy)
    destroy: {
      methods: ['delete'],
      route: blueprints.routes.destroy,
      fn: function (req, res) {
        model
          .destroy({ where: { id: req.params[0] } })
          .then(res.deleted);
      }
    }

  };

};

module.exports = blueprints;
