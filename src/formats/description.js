'use strict';

const { flatten, getWordsList } = require('../utilities');

const formats = require('./adapters');

// Retrieve all possible extensions, for description/documentation
const getExtNames = function () {
  const extNamesA = formats.map(({ extNames = [] }) => extNames);
  const extNamesB = flatten(extNamesA);
  return extNamesB;
};

// All possible formats, for documentation
const getDescription = function () {
  const titles = formats.map(({ title }) => title);
  return getWordsList(titles);
};

module.exports = {
  getExtNames,
  getDescription,
};
