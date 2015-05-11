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
  //var ctx = this;

  if (handler.wrapped === true) {
    return handler;
  }

  function action(req, res, next) {
    var result = handler(req, res, next);
    //var result = handler.call(ctx, req, res, next);

    if (res.headersSent === true) {
      //eventsLog.error('Headers already send.');
      return;
    }

    if (!result) {
      return;
    }

    if (typeof result.then === 'function') {
      var method = req.method.toLowerCase()
        , success = responseStrategy(res, method);

      return result
        .then(success)
        .catch(res.error);
    } else {
      //eventsLog.error('Action output is not a Promise instance.'
      //  + ' Action should return Promise or undefined. If Promise is returned and response was send'
      //  + ' within action function headers may be send twice.', {
      //  method: req.method,
      //  url: req.originalUrl || req.url
      //});
    }
  }

  action.wrapped = true;
  //action.name = config.name;
  //action.id = config.id;
  //action.mountPath = config.mountPath;
  //action.methods = config.methods;

  return action;
}

exports = module.exports = actionWrapper;
