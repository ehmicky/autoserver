'use strict';

const { getProps } = require('../../errors');
const { STATUS_LEVEL_MAP } = require('../../log');

// Retrieve response's status
// TODO: why is this called twice???
const getStatus = function ({ error }) {
  const { status = 'SERVER_ERROR' } = getProps(error);
  const level = STATUS_LEVEL_MAP[status];
  return { status, level };
};

module.exports = {
  getStatus,
};
