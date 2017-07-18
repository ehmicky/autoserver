'use strict';

const checkObject = function (obj) {
  const isObject = obj && obj.constructor === Object;
  if (isObject) { return; }

  const message = `Utility must be used with objects: '${obj}'`;
  throw new Error(message);
};

module.exports = {
  checkObject,
};
