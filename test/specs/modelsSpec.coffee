'use strict'

configFixture = require '../fixtures/config'
support = require '../../lib/support'
Sequelize = require 'sequelize'
mockery = require 'mockery'
path = require 'path'
sinon = require 'sinon'

models = null
utilStub = null

resources = (sequelize, Sequelize) ->
  sequelize.define 'resources',
    title: Sequelize.STRING

users = (sequelize, Sequelize) ->
  sequelize.define 'users',
    name: Sequelize.STRING
    email:
      type: Sequelize.STRING
      validate:
        isEmail: true
    avatar:
      type: Sequelize.STRING
      allowNull: true

describe 'Models provider', ->

  before (done) ->

    utilStub = sinon.stub support, 'loadFiles'
    utilStub.withArgs(path.normalize '/app/api/models').returns ['resources', 'users']
    utilStub.throws 'STUB_ENOENT'

    registerMock '../config', configFixture
    registerMock './support', support
    registerMock './log/events',
      auto: sinon.spy()
    registerMock '/app/api/models/resources', resources
    registerMock '/app/api/models/users', users
    registerMock '/app/config/models',
      connection:
        database: 'test_surf'
        user: process.env.USER
        password: ''
      options:
        dialect: 'mysql'
        logging: false

    mockery.enable
      warnOnUnregistered: false
      warnOnReplace: false
      useCleanCache: true

    models = require '../../lib/models'
    models.sequelize.sync
      force: true
    .then ->
      models.resources.bulkCreate [
        { title: 'Aliquam rutrum molestie rutrum.' }
        { title: 'Nulla laoreet.' }
      ]
    .then ->
      models.users.bulkCreate [
        { name: 'John Brown', email: 'j.brown@gmail.com' }
        { name: 'Mark Down', email: 'mark.down@yahoo.com' }
      ]
    .done done

  after ->

    utilStub.restore()
    mockery.deregisterAll()
    mockery.disable()

  it 'should return defined models', ->
    expect(models).to.have.property 'resources'
    expect(models).to.have.property 'users'

  it 'should return formated output from find(All) methods', (done) ->
    models.users.find(1)
    .then (res) ->
      expect(res).to.have.property 'name', 'John Brown'
      expect(res).to.have.property 'email', 'j.brown@gmail.com'
      return res
    .done (err, res) ->
      expect(err).to.be.null
      expect(res).to.have.property 'id', 1
      expect(res).to.have.property 'avatar', null
      done()
