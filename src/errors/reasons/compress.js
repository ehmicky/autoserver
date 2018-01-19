'use strict';

const { getAdapterMessage } = require('./message');

// Extra:
//  - adapter `{string}`: adapter name
const COMPRESS = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific compress adapter',
  getMessage: getAdapterMessage,
};

module.exports = {
  COMPRESS,
};
