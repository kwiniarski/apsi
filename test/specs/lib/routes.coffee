'use strict';
sinon = require 'sinon'

server = null
agent = null

asAdmin           = sinon.spy require '../../example/api/policies/as-admin'
asUser            = sinon.spy require '../../example/api/policies/as-user'
isAuthenticated   = sinon.spy require '../../example/api/policies/is-authenticated'
isTrusted         = sinon.spy require '../../example/api/policies/is-trusted'

describe 'Route provider', ->

  before (done) ->
    mockery.enable
      warnOnUnregistered: false
      useCleanCache: true

    server = createServerAndSyncDatabase done
    agent = request server.application

  after (done) ->
    mockery.disable()
    server.instance.on 'close', done
    server.instance.close()

  describe 'mount CRUD routes for the resource model', ->

    describe 'GET /products route', ->
      it 'should return subset of all resources', (done) ->
        agent.get('/products').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status 200
          expect(res.body).to.have.deep.property '[0].title', 'Aliquam rutrum molestie rutrum.'
          expect(res.body).to.have.deep.property '[1].title', 'Nulla laoreet.'
          done()

    describe 'GET /products/:id route', ->
      it 'should return selected resource', (done) ->
        agent.get('/products/2').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status 200
          expect(res.body).to.have.deep.property 'title', 'Nulla laoreet.'
          expect(res.body).to.have.deep.property 'id', 2
          done()

    describe 'POST /products route', ->
      it 'should create exactly one record with new id', (done) ->
        agent.post('/products').send({ title: 'Lorem ipsum dolor sit amet.' }).end (err, res) ->
          expect(err).to.be.null
          expect(res).to.have.status(201).and.have.header 'location', '/products/3'
          expect(res.body).to.be.empty
          done()

    describe 'PUT /products/:id route', ->
      it 'should update record with given id if it exists with new data', (done) ->
        agent.put('/products/3').send({ title: 'Nunc id velit vel metus.' }).end (err, res) ->
          expect(err).to.be.null
          expect(res).to.have.status 204
          expect(res.body).to.be.empty
          done()
      it 'should create record under given id if it not exists', (done) ->
        agent.put('/products/4').send({ title: 'Lorem ipsum dolor sit amet.' }).end (err, res) ->
          expect(err).to.be.null
          expect(res).to.have.status(201).and.have.header 'location', '/products/4' # cannot test it with SQLite
          expect(res.body).to.be.empty
          done()

    describe 'DELETE /products/:id route', ->
      it 'should delete selected record and return 204 No Content status', (done) ->
        agent.delete('/products/4').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.have.status 204
          expect(res.body).to.be.empty
          done()

  describe 'when controller is created for the resource model', ->

    describe 'extend blueprint routes overwriting CRUD methods when needed', ->
      it 'should not return any data for overwritten method because email have to be provided as id', (done) ->
        agent.get('/users/1').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status 404
          expect(res.body).to.be.not.null
          done()
      it 'should return data for overwritten method because valid email is provided as id', (done) ->
        agent.get('/users/j.brown@gmail.com').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status 200
          expect(res.body).to.have.deep.property 'name', 'John Brown'
          done()

    describe 'extend blueprints with custom methods converting controller name to URL', ->
      it 'should add GET /users/list-avatar-images from listAvatarImages method', (done) ->
        agent.get('/users/list-avatar-images').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status 200
          expect(res.body).to.have.deep.property '[0].avatar', null
          expect(res.body).to.have.deep.property '[1].avatar', null
          done()

  describe 'when controller configuration is created for the resource model', ->
    it 'should add POST /users/add-image route using addAvatarImage method and its configuration', (done) ->
      agent.post('/users/add-image').send({ image: 'avatar.png', id: 1 }).end (err, res) ->
        expect(err).to.be.null
        expect(res).to.be.json.and.have.status 200
        expect(res.body).to.have.deep.property 'avatar', 'avatar.png'
        done()

  describe 'error handling', ->
    it 'should return 400 Bad request for model validation errors', (done) ->
      agent.post('/users').send
        name: 'John Novak'
        email: 'novak.mail'
        avatar: 'novak.png'
      .end (err, res) ->
        expect(res).to.be.json.and.have.status 400
        expect(res.body).to.have.deep.property 'name', 'Bad Request'
        expect(res.body).to.have.deep.property 'message', 'Validation error'
        expect(res.body).to.have.deep.property 'errors[0].message', 'Validation isEmail failed'
        done()
    it 'should return 404 Not Found for missing routes', (done) ->
      agent.get('/users/not/existing/url').end (err, res) ->
        expect(res).to.be.json.and.have.status 404
        expect(res.body).to.have.deep.property 'name', 'Not Found'
        done()
    it 'should return 405 Method Not Allowed status for missing VERBs', (done) ->
      agent.put('/users/add-image').end (err, res) ->
        expect(res).to.be.json.and.have.status 405
        expect(res.body).to.have.deep.property 'name', 'Method Not Allowed'
        done()


