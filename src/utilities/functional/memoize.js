'use strict';

const fastMemoize = require('fast-memoize');

const memoize = (func, { serializer } = {}) =>
  fastMemoize(func, { serializer });

module.exports = {
  memoize,
};
