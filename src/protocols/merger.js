'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');
const { addErrorHandlers } = require('./error');

const adaptersA = adapters.map(addErrorHandlers);

const protocolAdapters = keyBy(adaptersA);

module.exports = {
  protocolAdapters,
};
