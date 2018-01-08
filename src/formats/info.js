'use strict';

const { formatAdapters } = require('./merger');

// Is format among the possible adapters
const formatExists = function ({ format }) {
  return formatAdapters[format] !== undefined;
};

// Raw format is binary
const isRawFormat = function ({ format }) {
  const { isRaw } = formatAdapters[format];
  return isRaw;
};

// Unsafe formats execute code, e.g. JavaScript
const isSafeFormat = function ({ format }) {
  const { unsafe } = formatAdapters[format];
  return !unsafe;
};

// Retrieves format's human-friendly title
const getTitle = function ({ format }) {
  const { title } = formatAdapters[format];
  return title;
};

// Retrieves format's possible charsets
const getCharsets = function ({ format }) {
  const { charsets } = formatAdapters[format];
  return charsets;
};

// Retrieves format's prefered charset
const getCharset = function ({ format }) {
  const charsets = getCharsets({ format }) || [];
  return charsets[0];
};

const supportsCharset = function ({ format, charset }) {
  const charsets = getCharsets({ format });
  return charsets === undefined || charsets.includes(charset);
};

// All possible extensions, for documentation
const getExtNames = function () {
  return Object.values(formatAdapters)
    .map(({ name }) => getExtName({ format: name }))
    .filter(extName => extName !== '');
};

// Retrieve format's prefered extension
const getExtName = function ({ format }) {
  const { extNames: [extName] = [] } = formatAdapters[format];
  if (extName === undefined) { return ''; }

  return `.${extName}`;
};

const EXT_NAMES = getExtNames();

module.exports = {
  formatExists,
  isRawFormat,
  isSafeFormat,
  getTitle,
  supportsCharset,
  getCharset,
  getExtName,
  EXT_NAMES,
};
