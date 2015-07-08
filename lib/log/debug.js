var _ = require('lodash');
var debug = require('debug');
var log = require('./events');

var envDebugEnabled = !_.isEmpty(process.env.DEBUG);
var consoleTransport = log.transports.console;
var debugToConsole = consoleTransport
  && consoleTransport.silent === false
  && consoleTransport.level === 'debug';

// TODO Decide if we should integrate debug with events-log

//if (envDebugEnabled && debugToConsole) {
//  debug.log = function () {
//    var args = _.toArray(arguments);
//    args[0] = _.trim(args[0]).replace(/\u001b\[\d+(;1)?m/g, '');
//    log.debug.apply(log, args);
//  };
//}

//module.exports = function (namespace) {
//  return envDebugEnabled ? debug(namespace) : function () {
//    var args = _.toArray(arguments);
//    args[0] = namespace + ' ' + args[0];
//    log.debug.apply(log, args);
//  };
//};

module.exports = debug;
