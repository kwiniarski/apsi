/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var urlResolve = require('url').resolve;

function ResourceActionBlueprint(model, mountPath) {
  this.model = model;
  this.mountPath = mountPath;
  this.primaryKey = model.primaryKeyAttribute || 'id';
}



ResourceActionBlueprint.prototype.create = {
  name: 'create',
  mountPath: '/:id([a-z0-9]+)',
  methods: ['POST'],
  handler: function createBlueprint(req) {
    if (req.body instanceof Array) {
      return this.model.bulkCreate(req.body);
    }
    else {
      return this.model.create(req.body).then(function (data) {
        return urlResolve(this.mountPath, data[this.primaryKey]);
      }.bind(this));
    }
  }
};

ResourceActionBlueprint.prototype.update = {
  name: 'update',
  mountPath: '/:id([a-z0-9]+)',
  methods: ['PUT'],
  handler: function updateBlueprint(req) {
    if (req.params.id) {
      req.body.id = req.params.id;
      return this.model.upsert(req.body).then(function (status) {
        return status === true ? urlResolve(this.mountPath, req.params.id) : null;
      }.bind(this));
    }
    else {
      return this.model.update(req.body, {
        where: req.query
      });
    }
  }
};

ResourceActionBlueprint.prototype.find = {
  name: 'find',
  mountPath: ['/', '/:id([a-z0-9]+)'],
  methods: ['GET'],
  handler: function findBlueprint(req) {
    if (req.params.id) {
      return this.model.findOne(req.params.id);
    }
    else {
      return this.model.findAll({
        where: req.query
      });
    }
  }
};

ResourceActionBlueprint.prototype.destroy = {
  name: 'destroy',
  mountPath: '/:id([a-z0-9]+)',
  methods: ['DELETE'],
  handler: function destroyBlueprint(req) {
    return this.model.destroy({ where: { id: req.params.id } });
  }
};

module.exports = ResourceActionBlueprint;
