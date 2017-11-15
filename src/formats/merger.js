'use strict';

const { keyBy } = require('../utilities');

const formats = require('./handlers');

// Means this is not a structured type, like media types,
// and unlike JSON or YAML
// This won't be parsed (i.e. returned as is), and will use 'binary' charset
const raw = {};

const formatHandlers = keyBy(formats);
const formatHandlersA = { ...formatHandlers, raw };

const defaultFormat = formatHandlers.json;
const defaultCharset = 'binary';

module.exports = {
  formatHandlers: formatHandlersA,
  defaultFormat,
  defaultCharset,
};
