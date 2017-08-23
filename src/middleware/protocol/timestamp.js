'use strict';

const getTimestamp = function ({ now }) {
  const timestamp = (new Date(now)).toISOString();

  return { timestamp };
};

module.exports = {
  getTimestamp,
};
