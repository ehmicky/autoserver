'use strict';


const fastMemoize = require('fast-memoize');
const { stringify } = require('circular-json');


const memoize = func => fastMemoize(func, { serializer: stringify });


module.exports = {
  memoize,
};
