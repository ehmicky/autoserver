'use strict';

const { getWordsList } = require('../utilities');

const formats = require('./adapters');

// All possible formats, for documentation
const getDescription = function () {
  const titles = formats.map(({ title }) => title);
  return getWordsList(titles);
};

module.exports = {
  getDescription,
};
