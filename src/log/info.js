'use strict';

const { getMember } = require('../adapters');

const logAdapters = require('./adapters');

const LOG_OPTS = getMember(logAdapters, 'opts', {});

module.exports = {
  LOG_OPTS,
};
