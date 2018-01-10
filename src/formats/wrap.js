'use strict';

const { wrapAdapters } = require('../adapters');

const adapters = require('./adapters');
const { getCharset, hasCharset } = require('./charset');
const { parseContent, serializeContent } = require('./content');
const { parseFile, serializeFile } = require('./file');
const { getExtension } = require('./extensions');

const members = [
  'name',
  'title',
  'unsafe',
];

const methods = {
  getCharset,
  hasCharset,
  parseContent,
  serializeContent,
  parseFile,
  serializeFile,
  getExtension,
};

const formatAdapters = wrapAdapters({
  adapters,
  members,
  methods,
  reason: 'FORMAT',
});

module.exports = {
  formatAdapters,
};
