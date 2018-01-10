'use strict';

const { extname } = require('path');

const { is: isType } = require('type-is');

const { getAdapter } = require('../adapters');

const { formatAdapters } = require('./wrap');

// Retrieve correct format, using MIME type
// Returns undefined if nothing is found
const getByMime = function ({ mime, safe }) {
  const formats = getFormats({ safe });

  // We try the extensions MIME (e.g. `+json`) after the other MIME types
  // (e.g. `application/jose+json`)
  const format = formats
    .find(({ mimes }) => mimeMatches({ mime, mimes }));
  if (format !== undefined) { return format.wrapped; }

  const formatA = formats
    .find(({ mimeExtensions: mimes }) => mimeMatches({ mime, mimes }));
  if (formatA !== undefined) { return formatA.wrapped; }

  throwUnsupportedFormat({ format });
};

// Only the right side of `isType` allow complex types like
// `application/*` or `+json`. However, we might use them both in
// `mime` (e.g. with Content-Type HTTP header `application/*`) or in
// `formats` (e.g. with JSON format `+json`), so we check both sides
const mimeMatches = function ({ mime, mimes = [] }) {
  return mimes.some(mimeA => isType(mime, mimeA) || isType(mimeA, mime));
};

// Retrieve correct format, using file extension
const getByExt = function ({ path, safe }) {
  const formats = getFormats({ safe });

  const fileExt = extname(path).slice(1);
  const format = formats
    .find(({ extensions = [] }) => extensions.includes(fileExt));
  if (format !== undefined) { return format.wrapped; }

  throwUnsupportedFormat({ format });
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

// Retrieve format adapter
const getFormat = function (key, { safe = false } = {}) {
  const format = getAdapter({ adapters: formatAdapters, key, name: 'format' });

  const isSafe = !safe || !format.unsafe;
  if (isSafe) { return format; }

  throwUnsupportedFormat({ format });
};

const throwUnsupportedFormat = function ({ format }) {
  const message = `Unsupported format: '${format}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  getByMime,
  getByExt,
  getFormat,
};
