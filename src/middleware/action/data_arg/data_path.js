'use strict';

const { isModelType } = require('./validate');

// Retrieve the path to each nested object inside `args.data`
const getDataPath = function ({ data, path }) {
  if (!isModelType(data)) { return []; }

  if (!Array.isArray(data)) { return [path]; }

  return Object.keys(data).map(ind => [...path, Number(ind)]);
};

module.exports = {
  getDataPath,
};
