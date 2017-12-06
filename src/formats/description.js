'use strict';

const { flatten, getWordsList } = require('../utilities');

const formats = require('./adapters');

// Retrieve all possible extensions, for description/documentation
const getExtNames = function (type) {
  const extNames = formats
    .filter(({ types }) => types.includes(type))
    .map(({ extNames: exts = [] }) => exts);
  const extNamesA = flatten(extNames);
  return extNamesA;
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
