'use strict';

const { getAdapterMessage } = require('./message');

// Extra:
//  - adapter `{string}`: adapter name
const DATABASE = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific database adapter',
  getMessage: getAdapterMessage,
};

module.exports = {
  DATABASE,
};
