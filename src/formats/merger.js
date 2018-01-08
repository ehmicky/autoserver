'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

const formatAdapters = keyBy(adapters);

module.exports = {
  formatAdapters,
};
