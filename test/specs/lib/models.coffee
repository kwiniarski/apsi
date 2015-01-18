'use strict'

server = null
models = null

describe 'Models provider', ->

  before (done) ->
    mockery.enable
      warnOnUnregistered: false
      useCleanCache: true

    server = createServerAndSyncDatabase done
    models = server.models

  after (done) ->
    mockery.disable()
    server.instance.on 'close', done
    server.instance.close()

  it 'should return defined models', ->
    expect(models).to.have.property 'products'
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
