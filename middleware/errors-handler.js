/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = function errorsHandler(err, req, res, next) {

  res.status(err.status || 500);
  res.format({
    'application/json': function () {
      res.json({
        error: err,
        data: null
      });
    },
    'text/plain': function () {
      res.send(err);
    },
    'text/html': function () {
      res.send(err);
    },
    'default': function () {
      res.send(err);
    }
  });

};
