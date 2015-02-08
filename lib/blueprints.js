/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var RequestError = require('./errors').RequestError;
var blueprints = {};

blueprints.routes = {
  find: /^\/([0-9a-z]+)$/i,
  findAll: /^\/$/,
  create: /^\/$/,
  update: /^\/([0-9a-z]+)$/i,
  destroy: /^\/([0-9a-z]+)$/i
};

blueprints.RESERVED_METHODS = Object.keys(blueprints.routes);

blueprints.getDefaultActions = function (model, modelName) {

  var mountPath = '/' + modelName
    , primaryKey = model.primaryKeyAttribute || 'id'
    , location = function (id) {
        return mountPath + '/' + id;
      };

  return {

    // Create
    create: {
      methods: ['post'],
      route: blueprints.routes.create,
      fn: function (req) {
        if (req.body instanceof Array) {
          return model.bulkCreate(req.body);
        }
        else {
          return model.create(req.body).then(function (data) {
            return location(data[primaryKey]);
          });
        }
      }
    },

    // Create or Update (Modify)
    update: {
      methods: ['put'],
      route: blueprints.routes.update,
      fn: function (req, res, next) {
        var id = req.body.id = req.params[0];
        return model.upsert(req.body).then(function (status) {
          return status === true ? location(id) : null;
        });
      }
    },

    // Read (Retrieve)
    find: {
      methods: ['get'],
      route: blueprints.routes.find,
      fn: function (req, res, next) {
        return model.findOne(req.params[0]);
      }
    },

    findAll: {
      methods: ['get'],
      route: blueprints.routes.findAll,
      fn: function (req, res, next) {
        return model.findAll();
      }
    },

    // Delete (Destroy)
    destroy: {
      methods: ['delete'],
      route: blueprints.routes.destroy,
      fn: function (req, res, next) {
        return model.destroy({ where: { id: req.params[0] } });
      }
    }

  };

};

module.exports = blueprints;
