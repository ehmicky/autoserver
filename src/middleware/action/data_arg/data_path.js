'use strict';

const { isModelType } = require('./validate');

// Retrieve the path to each nested object inside `args.data`
const getDataPath = function ({ data, commandPath }) {
  if (!isModelType(data)) { return []; }

  if (!Array.isArray(data)) { return [commandPath]; }

  return Object.keys(data).map(index => [...commandPath, Number(index)]);
};

module.exports = {
  getDataPath,
};
