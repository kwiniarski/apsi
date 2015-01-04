'use strict';

express = require 'express'
app = express()
app.use require '../../middleware/request'
app.use require '../../middleware/response'
app.use require('body-parser').json()
server = null
agent = request app

Sequelize = require 'sequelize'

sequelize = new Sequelize 'test_surf', process.env.USER, '',
  dialect: 'mysql'
  logging: false

Resources = sequelize.define 'resources',
  title: Sequelize.STRING

Users = sequelize.define 'users',
  name: Sequelize.STRING
  email:
    type: Sequelize.STRING
    validate:
      isEmail: true
  avatar:
    type: Sequelize.STRING
    allowNull: true

UsersController =
  listAvatarImages:
    methods: ['get']
    route: '/list-avatar-images'
    fn: (req, res) ->
      Users.findAll { attributes: ['avatar'] }
      .then res.ok
  addAvatarImage:
    methods: ['post']
    route: '/add-image'
    fn: (req, res) ->
      Users.update { avatar: req.body.image }, { where: id: req.param 'id' }
      .then ->
        Users.find req.param 'id'
      .then res.ok
  find:
    methods: ['get']
    route: /^\/([\w\.]+@[\w\.]+)$/i
    fn: (req, res) ->
      Users.find
        where:
          email: req.params[0]
      .then res.ok

describe 'Route provider', ->

  before (done) ->

    sequelize.sync
      force: true
    .then ->
      Resources.bulkCreate [
        { title: 'Aliquam rutrum molestie rutrum.' }
        { title: 'Nulla laoreet.' }
      ]
    .then ->
      Users.bulkCreate [
        { name: 'John Brown', email: 'j.brown@gmail.com' }
        { name: 'Mark Down', email: 'mark.down@yahoo.com' }
      ]
    .done done

    registerMock './models',
      resources: Resources
      users: Users
    registerMock './controllers',
      users: UsersController
    mockery.enable
      warnOnUnregistered: false
      warnOnReplace: false
      useCleanCache: true

    app.use require '../../lib/routes'
    app.use require '../../middleware/errors-handler'
    server = app.listen 9000

  after (done) ->

    server.on 'close', done
    mockery.deregisterAll()
    mockery.disable()
    server.close()

  describe 'mount CRUD routes for the resource model', ->

    describe 'GET /resources route', ->
      it 'should return subset of all resources', (done) ->
        agent.get('/resources').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status 200
          expect(res.body).to.have.deep.property '[0].title', 'Aliquam rutrum molestie rutrum.'
          expect(res.body).to.have.deep.property '[1].title', 'Nulla laoreet.'
          done()

    describe 'GET /resources/:id route', ->
      it 'should return selected resource', (done) ->
        agent.get('/resources/2').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status 200
          expect(res.body).to.have.deep.property 'title', 'Nulla laoreet.'
          expect(res.body).to.have.deep.property 'id', 2
          done()

    describe 'POST /resources route', ->
      it 'should create exactly one record with new id', (done) ->
        agent.post('/resources').send({ title: 'Lorem ipsum dolor sit amet.' }).end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status(201).and.have.header 'location', '/resources/3'
          expect(res.body).to.have.deep.property 'title', 'Lorem ipsum dolor sit amet.'
          expect(res.body).to.have.deep.property 'id', 3
          done()

    describe 'PUT /resources/:id route', ->
      it 'should update record with given id if it exists with new data', (done) ->
        agent.put('/resources/3').send({ title: 'Nunc id velit vel metus.' }).end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status 200
          expect(res.body).to.have.deep.property 'title', 'Nunc id velit vel metus.'
          expect(res.body).to.have.deep.property 'id', 3
          done()
      it 'should create record under given id if it not exists', (done) ->
        agent.put('/resources/4').send({ title: 'Lorem ipsum dolor sit amet.' }).end (err, res) ->
          expect(err).to.be.null
          expect(res).to.be.json.and.have.status(201).and.have.header 'location', '/resources/4' # cannot test it with SQLite
          expect(res.body).to.have.deep.property 'title', 'Lorem ipsum dolor sit amet.'
          expect(res.body).to.have.deep.property 'id', 4
          done()

    describe 'DELETE /resources/:id route', ->
      it 'should delete selected record and return 204 No Content status', (done) ->
        agent.delete('/resources/4').end (err, res) ->
          expect(err).to.be.null
          expect(res).to.have.status 204
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


