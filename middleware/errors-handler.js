/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = function errorsHandler(err, req, res, next) {
  res.status(err.status || 500).type(err.type || 'json').send({
    error: err,
    data: null
  });
};
