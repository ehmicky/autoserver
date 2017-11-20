'use strict';

const { keyBy } = require('../utilities');

const formats = require('./handlers');

const formatHandlers = keyBy(formats);

// Means this is not a structured type, like media types,
// and unlike JSON or YAML
// This won't be parsed (i.e. returned as is), and will use 'binary' charset
const raw = {};
const formatHandlersA = { ...formatHandlers, raw };

const DEFAULT_FORMAT = formatHandlers.json;

module.exports = {
  formatHandlers: formatHandlersA,
  DEFAULT_FORMAT,
};
