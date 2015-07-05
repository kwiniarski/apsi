//var eventsLog = require('../log/events');

function responseStrategy(res, method) {
  switch (method) {
    case 'post': return res.created;
    case 'get': return res.okOrNotFound;
    case 'put': return res.createdOrNoContent;
    case 'delete': return res.noContent;

  }
}

function actionWrapper(handler) {

  if (handler.wrapped === true) {
    return handler;
  }

  function action(req, res, next) {
    var result = handler(req, res, next);

    if (res.headersSent === true) {
      //eventsLog.error('Headers already send.');
      return;
    }

    if (!result) {
      return;
    }

    if (typeof result.then === 'function') {
      var method = req.method.toLowerCase();
      var success = responseStrategy(res, method);

      return result
        .then(success)
        .catch(res.error);
    }
    else {
      //eventsLog.error('Action output is not a Promise instance.'
      //  + ' Action should return Promise or undefined. If Promise is returned and response was send'
      //  + ' within action function headers may be send twice.', {
      //  method: req.method,
      //  url: req.originalUrl || req.url
      //});
    }
  }

  action.wrapped = true;
  return action;
}

exports = module.exports = actionWrapper;
