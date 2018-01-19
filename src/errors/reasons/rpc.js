'use strict';

const { getAdapterMessage } = require('./message');

// Extra:
//  - adapter `{string}`: adapter name
const RPC = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific rpc adapter',
  getMessage: getAdapterMessage,
};

module.exports = {
  RPC,
};
