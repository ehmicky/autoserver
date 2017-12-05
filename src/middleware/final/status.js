'use strict';

const { getProps } = require('../../error');
const { STATUS_LEVEL_MAP } = require('../../log');

// Retrieve response's status
const getStatus = function ({ error }) {
  const { status = 'SERVER_ERROR' } = getProps({ error });
  const level = STATUS_LEVEL_MAP[status];
  return { status, level };
};

module.exports = {
  getStatus,
};
