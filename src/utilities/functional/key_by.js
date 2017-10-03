'use strict';

const { assignObject } = require('./reduce');

// Similar to Lodash __.keyBy() but faster
const keyBy = function (array) {
  return Object.values(array)
    .map(obj => ({ [obj.name]: obj }))
    .reduce(assignObject, {});
};

module.exports = {
  keyBy,
};
