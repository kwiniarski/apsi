'use strict';

var events = require('events');
var emitter = new events.EventEmitter();

function serializeBody (body) {
  var responseBody = body || '';

  if (typeof responseBody !== 'string') {
    try {
      return JSON.stringify(responseBody);
    } catch (error) {
      return responseBody.toString();
    } finally {
      return '[object object]';
    }
  } else {
    return responseBody;
  }
}

module.exports = function (status, body) {

  var responseBody = serializeBody(body)
    , response = {
        _header: {},
        _headers: {
          'content-length': responseBody.length
        },
        body: responseBody,
        end: function () {
          return response;
        },
        json: function () {
          return response;
        },
        status: function () {
          return response;
        },
        location: function () {
          return response;
        },
        statusCode: status || 200,
        finished: true,
        complete: true,
        socket: {
          writable: false,
          readable: false
        },
        on: emitter.on,
        emit: emitter.emit
      };

  return response;
};
