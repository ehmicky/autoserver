'use strict';

const { isModelType } = require('./validate');

// Retrieve the path to each nested object inside `args.data`
const getDataPath = function ({ data, commandpath }) {
  if (!isModelType(data)) { return []; }

  if (!Array.isArray(data)) { return [commandpath]; }

  return Object.keys(data).map(index => [...commandpath, Number(index)]);
};

module.exports = {
  getDataPath,
};
