'use strict';


const fastMemoize = require('fast-memoize');
const { stringify } = require('../stringify');


const memoize = (func, { serializer = stringify } = {}) =>
  fastMemoize(func, { serializer });


module.exports = {
  memoize,
};
