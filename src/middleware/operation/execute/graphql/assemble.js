'use strict';

const { set } = require('../../../../utilities');

const assemble = function ({ actions }) {
  return actions
    .reduce(
      (response, { data, actionPath }) => set(response, actionPath, data),
      {},
    );
};

module.exports = {
  assemble,
};
