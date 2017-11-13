'use strict';

const { assignArray, getWordsList } = require('../utilities');

const formats = require('./handlers');

// Retrieve all possible extensions, for description/documentation
const getExtNames = function () {
  return formats
    .map(({ extNames: exts = [] }) => exts)
    .reduce(assignArray, []);
};

const extNames = getExtNames();

// All possible formats, for documentation
const getDescription = function () {
  const titles = formats.map(({ title }) => title);
  return getWordsList(titles);
};

const description = getDescription();

module.exports = {
  extNames,
  description,
};
