/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var util = require('util')
  , os = require('os')
  , STATUS_CODES = require('http').STATUS_CODES;

/**
 * Returns wrapper around RequestError constructor which presets HTTP status code allowing only for message param.
 * @param code {Number} HTTP status code.
 * @returns {Function}
 */
function status(code) {
  return function (message) {
    return new RequestError(code, message);
  };
}

/**
 * Request errors reflect HTTP status codes, in particular 4xx codes (client errors) and 5xx codes (server errors).
 * This constructor inherits from Error constructor with few differences. Firstly it takes different amount of
 * arguments and all are optional. Secondly it provides additional properties and exposes name property (it is
 * enumerable compared to Error).
 *
 * If status code is not provided it defaults to 500 Internal Server Error.
 * If status code is not a valid HTTP status code then RequestError name property is set to "RequestError".
 * If no message is provided then it defaults to RequestError name property.
 *
 * @param [status] {Number|*} HTTP status code. Error name is based on the status code.
 * @param [message] {String|Error} Message string or valid Error instance. If Error instance is provided then message
 * is set using Error.message property, and Error is stored internally.
 * @returns {RequestError}
 * @constructor
 */
function RequestError(status, message) {
  if (!this || !this instanceof RequestError) {
    return new RequestError(status, message);
  }

  /**
   * Instance property which shouldn't be enumerable because
   * we don't want to list stored stack traces in serialized data.
   */
  Object.defineProperty(this, 'stacks', {
    value: []
  });

  if (isNaN(status) || !STATUS_CODES[status]) {
    message = status;
  }
  else {
    this.status = status;
  }

  this.name = STATUS_CODES[this.status] || 'RequestError';
  this.message = this.name;
  this.errors = [];

  if (message instanceof Error) {
    if (message.errors instanceof Array) {
      this.errors = this.errors.concat(message.errors);
    }
    this.stacks.push(message);
    this.message = message.message;
  }
  else if (typeof message !== 'undefined') {
    this.message = message.toString();
  }
}

util.inherits(RequestError, Error);

RequestError.prototype.status = 500;

RequestError.BadRequest = status(400);
RequestError.Unauthorized = status(401);
RequestError.PaymentRequired = status(402);
RequestError.Forbidden = status(403);
RequestError.NotFound = status(404);
RequestError.MethodNotAllowed = status(405);
RequestError.NotAcceptable = status(406);
RequestError.ProxyAuthenticationRequired = status(407);
RequestError.RequestTimeout = status(408);
RequestError.Conflict = status(409);
RequestError.Gone = status(410);
RequestError.LengthRequired = status(411);
RequestError.PreconditionFailed = status(412);
RequestError.RequestEntityTooLarge = status(413);
RequestError.RequestURITooLong = status(414);
RequestError.UnsupportedMediaType = status(415);
RequestError.RequestedRangeNotSatisfiable = status(416);
RequestError.ExpectationFailed = status(417);

RequestError.InternalServerError = status(500);
RequestError.NotImplemented = status(500);
RequestError.BadGateway = status(500);
RequestError.ServiceUnavailable = status(500);
RequestError.GatewayTimeout = status(500);
RequestError.HTTPVersionNotSupported = status(500);

Object.defineProperty(RequestError.prototype, 'stack', {
  get: function stack() {
    var errorStack = (new Error()).stack;
    errorStack = errorStack.replace(/^Error.*\n.+RequestError.+\n/gm, this.name + ': ' + this.message + os.EOL);
    if (this.stacks.length) {
      for (var i = 0, j = this.stacks.length; i < j; i++) {
        errorStack += this.stacks[i].stack;
      }
    }
    return errorStack;
  }
});

module.exports = {
  STATUS_CODES: STATUS_CODES,
  RequestError: RequestError
};
