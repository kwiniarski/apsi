/* globals expect, mockery, request, syncDatabase */
/* jshint -W030 */

'use strict';

var sinon = require('sinon');
var server = null;
var agent = null;
var asAdmin = sinon.spy(require('../../example/api/policies/as-admin'));
var asUser = sinon.spy(require('../../example/api/policies/as-user'));
var isAuthenticated = sinon.spy(require('../../example/api/policies/is-authenticated'));
var isTrusted = sinon.spy(require('../../example/api/policies/is-trusted'));

describe('Route provider', function () {
  this.timeout(5000);
  before(function () {
    this.timeout(5000);
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    server = require('../../../index');
    return syncDatabase().tap(function () {
      agent = request(server.application);
    }).then(function () {
      return server.start();
    });
  });
  after(function () {
    mockery.disable();
    return server.stop();
  });
  describe('mount CRUD routes for the resource model', function () {
    describe('GET /products route', function () {
      it('should return subset of all resources', function (done) {
        return agent.get('/products').end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.json.and.have.status(200);
          expect(res.body).to.have.deep.property('[0].title', 'Aliquam rutrum molestie rutrum.');
          expect(res.body).to.have.deep.property('[1].title', 'Nulla laoreet.');
          done();
        });
      });
    });
    describe('GET /products/:id route', function () {
      it('should return selected resource', function (done) {
        return agent.get('/products/2').end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.json.and.have.status(200);
          expect(res.body).to.have.deep.property('title', 'Nulla laoreet.');
          expect(res.body).to.have.deep.property('id', 2);
          done();
        });
      });
    });
    describe('POST /products route', function () {
      it('should create exactly one record with new id', function (done) {
        return agent.post('/products').send({
          title: 'Lorem ipsum dolor sit amet.'
        }).end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201).and.have.header('location', '/products/3');
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
    describe('PUT /products/:id route', function () {
      it('should update record with given id if it exists with new data', function (done) {
        return agent.put('/products/3').send({
          title: 'Nunc id velit vel metus.'
        }).end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
          done();
        });
      });
      it('should create record under given id if it not exists', function (done) {
        return agent.put('/products/4').send({
          title: 'Lorem ipsum dolor sit amet.'
        }).end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201).and.have.header('location', '/products/4');
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
    describe('DELETE /products/:id route', function () {
      it('should delete selected record and return 204 No Content status', function (done) {
        return agent.delete('/products/4').end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
  });
  describe('when model is nested in directories', function () {
    it('should be mounted under same URL path as directory path', function (done) {
      return agent.get('/group/names').end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.be.json.and.have.status(200);
        done();
      });
    });
  });
  describe('when controller is created for the resource model', function () {
    describe('extend blueprint routes overwriting CRUD methods when needed', function () {
      it('should not return any data for overwritten method because email have to be provided as id', function (done) {
        return agent.get('/users/1').end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.json.and.have.status(404);
          expect(res.body).to.be.not.null;
          done();
        });
      });
      it('should return data for overwritten method because valid email is provided as id', function (done) {
        return agent.get('/users/j.brown@gmail.com').end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.json.and.have.status(200);
          expect(res.body).to.have.deep.property('name', 'John Brown');
          done();
        });
      });
    });
    describe('extend blueprints with custom methods converting controller name to URL', function () {
      it('should add GET /users/list-avatar-images from listAvatarImages method', function (done) {
        return agent.get('/users/list-avatar-images').end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.json.and.have.status(200);
          expect(res.body).to.have.deep.property('[0].avatar', null);
          expect(res.body).to.have.deep.property('[1].avatar', null);
          done();
        });
      });
    });
  });
  describe('when controller configuration is created for the resource model', function () {
    it('should add POST /users/add-image route using addAvatarImage method and its configuration', function (done) {
      return agent.post('/users/add-image').send({
        image: 'avatar.png',
        id: 1
      }).end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.be.json.and.have.status(200);
        expect(res.body).to.have.deep.property('avatar', 'avatar.png');
        done();
      });
    });
  });
  describe('error handling', function () {
    it('should return 400 Bad request for model validation errors', function (done) {
      return agent.post('/users').send({
        name: 'John Novak',
        email: 'novak.mail',
        avatar: 'novak.png'
      }).end(function (err, res) {
        expect(res).to.be.json.and.have.status(400);
        expect(res.body).to.have.deep.property('name', 'Bad Request');
        expect(res.body).to.have.deep.property('message');
        expect(res.body).to.have.deep.property('errors[0].message', 'Validation isEmail failed');
        done();
      });
    });
    it('should return 404 Not Found for missing routes', function (done) {
      return agent.get('/users/not/existing/url').end(function (err, res) {
        expect(res).to.be.json.and.have.status(404);
        expect(res.body).to.have.deep.property('name', 'Not Found');
        done();
      });
    });
    it('should return 405 Method Not Allowed status for missing VERBs', function (done) {
      return agent.put('/users/add-image').end(function (err, res) {
        expect(res).to.be.json.and.have.status(405);
        expect(res.body).to.have.deep.property('name', 'Method Not Allowed');
        done();
      });
    });
    it('should return 404 Not Found for models restricted by policy', function (done) {
      return agent.get('/restricted').end(function (err, res) {
        expect(res).to.be.json.and.have.status(404);
        expect(res.body).to.have.deep.property('name', 'Not Found');
        done();
      });
    });
  });
});

