'use strict';

const { pReadFile } = require('../promisify');

// Retrieve and parses a JSON file
// This might throw for many different reasons, e.g. wrong JSON syntax,
// or cannot access file (does not exist or no permissions)
const getJson = async function ({ path }) {
  const content = await pReadFile(path, { encoding: 'utf-8' });
  return JSON.parse(content);
};

module.exports = {
  getJson,
};
