'use strict';

const { extname } = require('path');

const { is: isType } = require('type-is');

const { formatAdapters } = require('./merger');
const { DEFAULT_RAW_FORMAT } = require('./constants');

// Retrieve correct format, using MIME type
// Returns undefined if nothing is found
const findByMime = function ({ mime, safe }) {
  const formats = getFormats({ safe });

  // We try the extensions MIME (e.g. `+json`) after the other MIME types
  // (e.g. `application/jose+json`)
  const format = formats
    .find(({ mimes }) => mimeMatches({ mime, mimes }));
  if (format !== undefined) { return format.name; }

  const formatA = formats
    .find(({ mimeExtensions: mimes }) => mimeMatches({ mime, mimes }));
  if (formatA !== undefined) { return formatA.name; }

  return DEFAULT_RAW_FORMAT;
};

// Only the right side of `isType` allow complex types like
// `application/*` or `+json`. However, we might use them both in
// `mime` (e.g. with Content-Type HTTP header `application/*`) or in
// `formats` (e.g. with JSON format `+json`), so we check both sides
const mimeMatches = function ({ mime, mimes = [] }) {
  return mimes.some(mimeA => isType(mime, mimeA) || isType(mimeA, mime));
};

// Retrieve correct format, using file extension
const findByExt = function ({ path, safe }) {
  const formats = getFormats({ safe });

  const fileExt = extname(path).slice(1);
  const format = formats
    .find(({ extNames = [] }) => extNames.includes(fileExt));
  if (format !== undefined) { return format.name; }

  return DEFAULT_RAW_FORMAT;
};

// Setting `safe` to `true` removes formats that execute code.
// For example, JavaScript can be allowed in config files, but should
// not be allowed in client payloads.
const getFormats = function ({ safe = false }) {
  const formats = Object.values(formatAdapters);

  if (!safe) { return formats; }

  const formatsA = formats.filter(({ unsafe }) => !unsafe);
  return formatsA;
};

module.exports = {
  findByMime,
  findByExt,
};
