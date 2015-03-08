/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var RequestError = require('./errors').RequestError;
var blueprints = module.exports;

blueprints.routes = {
  find: ['/', '/:id([a-z0-9]+)'],
  create: '/',
  update: '/:id([a-z0-9]+)',
  destroy: '/:id([a-z0-9]+)'
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
      fn: function createBlueprint(req) {
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
      fn: function updateBlueprint(req) {
        if (req.params.id) {
          req.body.id = req.params.id;
          return model.upsert(req.body).then(function (status) {
            return status === true ? location(req.params.id) : null;
          });
        }
        else {
          return model.update(req.body, {
            where: req.query
          });
        }
      }
    },

    // Read (Retrieve)
    find: {
      methods: ['get'],
      route: blueprints.routes.find,
      fn: function findBlueprint(req) {
        if (req.params.id) {
          return model.findOne(req.params.id);
        }
        else {
          return model.findAll({
            where: req.query
          });
        }
      }
    },

    // Delete (Destroy)
    destroy: {
      methods: ['delete'],
      route: blueprints.routes.destroy,
      fn: function destroyBlueprint(req) {
        return model.destroy({ where: { id: req.params.id } });
      }
    }

  };

};

