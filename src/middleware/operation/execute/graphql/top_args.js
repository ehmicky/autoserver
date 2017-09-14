'use strict';

const { getTopLevelAction } = require('./utilities');

// Retrieves `topArgs`
const getTopArgs = function ({ actions }) {
  return getTopLevelAction({ actions }).args;
};

module.exports = {
  getTopArgs,
};
