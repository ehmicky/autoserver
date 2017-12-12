'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');
const { getExtNames } = require('./description');

const formatAdapters = keyBy(adapters);

// Means this is not a structured type, like media types,
// and unlike JSON or YAML
// This won't be parsed (i.e. returned as is), and will use 'binary' charset
const raw = {};
const formatAdaptersA = { ...formatAdapters, raw };

const DEFAULT_FORMAT = formatAdapters.json;

const EXT_NAMES = getExtNames();

module.exports = {
  formatAdapters: formatAdaptersA,
  DEFAULT_FORMAT,
  EXT_NAMES,
};
