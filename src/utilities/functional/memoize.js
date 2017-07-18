'use strict';

const fastMemoize = require('fast-memoize');

const { stringifyJSON } = require('../json');

const memoize = (func, { serializer = stringifyJSON } = {}) =>
  fastMemoize(func, { serializer });

module.exports = {
  memoize,
};
