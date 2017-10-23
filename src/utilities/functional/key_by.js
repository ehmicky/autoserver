'use strict';

const { assignObject } = require('./reduce');

// Similar to Lodash __.keyBy() but faster
const keyBy = function (array, attr = 'name') {
  return array
    .map(obj => ({ [obj[attr]]: obj }))
    .reduce(assignObject, {});
};

module.exports = {
  keyBy,
};
