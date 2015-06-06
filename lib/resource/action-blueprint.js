/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var _ = require('lodash')
  , defineProperty = function(object, property, value) {
      Object.defineProperty(object, property, {
        value: value,
        enumerable: false,
        configurable: false
      });
    };

function resourceActionBlueprint(model, mountPath) {

  var proto = Object.create({});

  defineProperty(proto, 'model', model);
  defineProperty(proto, 'mountPath', mountPath);
  defineProperty(proto, 'primaryKey', model.primaryKeyAttribute || 'id');

  proto.create = function createBlueprint(req) {
    if (req.body instanceof Array) {
      return proto.model.bulkCreate(req.body);
    }
    else {
      return proto.model.create(req.body).then(function (data) {
        return proto.mountPath + '/' + data[proto.primaryKey];
      });
    }
  };

  _.assign(proto.create, {
    id: 'create',
    mountPath: '/',
    methods: ['POST']
  })

  proto.update = function updateBlueprint(req) {
    if (req.params.id) {
      req.body.id = req.params.id;
      return proto.model.upsert(req.body).then(function (status) {
        return status === true ? (proto.mountPath + '/' + req.params.id) : null;
      });
    }
    else {
      return proto.model.update(req.body, {
        where: req.query
      });
    }
  };

  _.assign(proto.update, {
    id: 'update',
    mountPath: '/:id([a-z0-9]+)',
    methods: ['PUT']
  });

  proto.find = function findBlueprint(req) {
    if (req.params.id) {
      return proto.model.findById(req.params.id);
    }
    else {
      return proto.model.findAll({
        where: req.query
      });
    }
  };

  _.assign(proto.find, {
    id: 'find',
    mountPath: ['/', '/:id([a-z0-9]+)'],
    methods: ['GET']
  });

  proto.destroy = function destroyBlueprint(req) {
    return proto.model.destroy({ where: { id: req.params.id } });
  };

  _.assign(proto.destroy, {
    id: 'destroy',
    mountPath: '/:id([a-z0-9]+)',
    methods: ['DELETE']
  });

  return proto;
}

module.exports = resourceActionBlueprint;
