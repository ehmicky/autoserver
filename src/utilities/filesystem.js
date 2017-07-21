'use strict';

const { readFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = async function (path) {
  const content = await promisify(readFile)(path, { encoding: 'utf-8' });
  return content;
};

module.exports = {
  readFile: readFileAsync,
};
