'use strict';

const { keyBy } = require('../utilities');

const formats = require('./handlers');

const formatHandlers = keyBy(formats);

module.exports = {
  formatHandlers,
};
