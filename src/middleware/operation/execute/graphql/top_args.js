'use strict';

// Retrieves `topArgs`
const getTopArgs = function ({ actions }) {
  const { args: topArgs } = actions
    .find(({ actionPath }) => actionPath.length === 1);
  return topArgs;
};

module.exports = {
  getTopArgs,
};
