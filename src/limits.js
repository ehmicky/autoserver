'use strict';

const getLimits = function ({ runOpts: { maxPageSize } }) {
  return {
    maxPageSize,
  };
};

module.exports = {
  getLimits,
};
