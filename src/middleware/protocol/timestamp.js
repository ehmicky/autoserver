'use strict';

const getTimestamp = function ({ now }) {
  const timestamp = (new Date(now)).toISOString();

  return {
    timestamp,
    ifvParams: { $NOW: timestamp },
  };
};

module.exports = {
  getTimestamp,
};
