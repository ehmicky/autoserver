'use strict';

const { getAdapterMessage } = require('./message');

// Extra:
//  - adapter `{string}`: adapter name
const LOG = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific log adapter',
  getMessage: getAdapterMessage,
};

module.exports = {
  LOG,
};
