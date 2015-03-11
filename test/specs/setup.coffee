'use strict'

Bluebird = require 'bluebird'

before ->
  @timeout 5000
  Bluebird.resolve()
    .delay 3000
    .then -> console.log 'database'

before ->
  @timeout 5000
  Bluebird.resolve()
    .delay 2000
    .then -> console.log 'server'
