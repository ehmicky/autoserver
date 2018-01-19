'use strict';

const { getAdapterMessage } = require('./message');

// Extra:
//  - adapter `{string}`: adapter name
const CHARSET = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific charset adapter',
  getMessage: getAdapterMessage,
};

module.exports = {
  CHARSET,
};
