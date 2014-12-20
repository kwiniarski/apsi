'use strict';

module.exports = function (req, res, next) {

  res.ok = function(status, data) {
    return res.status(status || 200).json({
      status: true,
      data: data || {}
    });
  };

  res.fail = function(status, data) {
    return res.status(status || 404).json({
      status: false,
      data: data || {}
    });
  };

  next();
};
