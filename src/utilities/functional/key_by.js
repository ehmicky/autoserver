'use strict';

// Similar to Lodash __.keyBy() but faster
const keyBy = function (array, attr = 'name') {
  const objs = array.map(obj => ({ [obj[attr]]: obj }));
  const objA = Object.assign({}, ...objs);
  return objA;
};

module.exports = {
  keyBy,
};
