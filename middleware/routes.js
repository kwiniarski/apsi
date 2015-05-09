/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

//module.exports = require('../lib/routes');

var Resource = require('../lib/resource')
  , policies = require('../lib/policy')
  , models = require('../models')
  , controllers = require('../lib/controllers')
  , router = require('express').Router();

var resources = {};

function registerResourceComponent(name, object) {
  for (var i in object) {
    if (!resources[i]) {
      resources[i] = {};
    }

    resources[i][name] = object[i];
  }
}

registerResourceComponent('model', models);
registerResourceComponent('controller', controllers);

for (var i in resources) {
  resources[i] = new Resource(resources[i].model, resources[i].controller);
  router.use(resources[i].getRouter());
}


//console.log(Resource);
//console.log(policies);
//console.log(controllers);
//console.log(resources);


module.exports = router;
