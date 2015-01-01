/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

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
      fn: function (req, res) {
        model
          .create(req.body)
          .then(res.formatOutputData)
          .done(function (err, data) {
            if (err) {
              res.badRequest(err);
            } else {
              res.created(data, mountPath + '/' + data.data.id);
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
              .then(res.formatOutputData)
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

        model.find(id)
          .then(res.formatOutputData)
          .then(res.ok);
      }
    },

    findAll: {
      methods: ['get'],
      route: blueprints.routes.findAll,
      fn: function (req, res) {
        model.findAll()
          .then(res.formatOutputData)
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
          .then(res.formatOutputData)
          .then(res.ok);
      }
    }

  };

};

module.exports = blueprints;
