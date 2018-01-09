'use strict';

const { wrapAdapters } = require('../utilities');

const adapters = require('./adapters');
const { getCharset, hasCharset } = require('./charset');
const { parseContent, serializeContent } = require('./content');
const { parseFile, serializeFile } = require('./file');

const members = [
  'name',
  'title',
];

const methods = {
  getCharset,
  hasCharset,
  parseContent,
  serializeContent,
  parseFile,
  serializeFile,
};

const formatAdapters = wrapAdapters({ adapters, members, methods });

module.exports = {
  formatAdapters,
};
