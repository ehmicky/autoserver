'use strict';

const { keyBy } = require('../utilities');

const formats = require('./handlers');

const formatHandlers = keyBy(formats);

const defaultFormat = formatHandlers.json;

const defaultCharset = 'binary';

module.exports = {
  formatHandlers,
  defaultFormat,
  defaultCharset,
};
