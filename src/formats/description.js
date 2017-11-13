'use strict';

const { assignArray, getWordsList } = require('../utilities');

const formats = require('./handlers');

// Retrieve all possible extensions, for description/documentation
const getExtNames = function (type) {
  return formats
    .filter(({ types }) => types.includes(type))
    .map(({ extNames: exts = [] }) => exts)
    .reduce(assignArray, []);
};

// All possible formats, for documentation
const getDescription = function (type) {
  const titles = formats
    .filter(({ types }) => types.includes(type))
    .map(({ title }) => title);
  return getWordsList(titles);
};

module.exports = {
  getExtNames,
  getDescription,
};
