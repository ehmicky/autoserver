'use strict';

const { throwError } = require('../error');

const checkObject = function (obj) {
  const isObject = obj && obj.constructor === Object;
  if (isObject) { return; }

  const message = `Utility must be used with objects: '${obj}'`;
  throwError(message);
};

module.exports = {
  checkObject,
};
