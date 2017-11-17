'use strict';

const { keyBy } = require('../utilities');

const formats = require('./handlers');

// Means this is not a structured type, like media types,
// and unlike JSON or YAML
// This won't be parsed (i.e. returned as is), and will use 'binary' charset
const raw = {};

const formatHandlers = keyBy(formats);
const formatHandlersA = { ...formatHandlers, raw };

const DEFAULT_FORMAT = formatHandlers.json;
const DEFAULT_INPUT_CHARSET = 'binary';
const DEFAULT_OUTPUT_CHARSET = 'utf-8';

module.exports = {
  formatHandlers: formatHandlersA,
  DEFAULT_FORMAT,
  DEFAULT_INPUT_CHARSET,
  DEFAULT_OUTPUT_CHARSET,
};
