'use strict';

const { throwError } = require('../errors');

const checkObject = function (obj) {
  const isObject = obj && obj.constructor === Object;
  if (isObject) { return; }

  const message = `Utility must be used with objects: '${obj}'`;
  throwError(message);
};

module.exports = {
  checkObject,
};
