'use strict';

const { getAdapterMessage } = require('./message');

// Extra:
//  - adapter `{string}`: adapter name
const FORMAT = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific format adapter',
  getMessage: getAdapterMessage,
};

module.exports = {
  FORMAT,
};
