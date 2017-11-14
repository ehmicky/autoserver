'use strict';

const { extname } = require('path');

const { is: isType } = require('type-is');

const allFormats = require('./handlers');

// Retrieve correct format, using MIME type
const findByMime = function ({ formats, mime }) {
  // We try the extensions MIME (e.g. `+json`) before the other MIME types
  // (e.g. `application/jose+json`)
  const format = getByMime({ formats, mime, filter: isNormalMime });
  if (format !== undefined) { return format; }

  const formatA = getByMime({ formats, mime, filter: isExtensionMime });
  if (formatA !== undefined) { return formatA; }

  // Means this is not a structured type, like media types,
  // and unlike JSON or YAML
  // This won't be parsed (i.e. returned as is), and will use 'binary' charset
  return { title: mime };
};

const getByMime = function ({ formats, mime, filter }) {
  return formats
    .map(({ mimes = [], ...format }) =>
      ({ ...format, mimes: mimes.filter(filter) }))
    .filter(({ mimes }) => mimes.length !== 0)
    .find(({ mimes }) => isType(mime, mimes));
};

const isNormalMime = function (mime) {
  return !mime.startsWith('+');
};

const isExtensionMime = function (mime) {
  return mime.startsWith('+');
};

// Retrieve correct format, using file extension
const findByExt = function ({ formats, path }) {
  const fileExt = extname(path).slice(1);
  const format = formats
    .find(({ extNames = [] }) => extNames.includes(fileExt));

  // Defaults to JSON
  if (format === undefined) { return allFormats[0]; }

  return format;
};

const findFormat = function ({ type, path, mime }) {
  const formats = allFormats.filter(({ types }) => types.includes(type));
  const finder = finders[type];
  const format = finder({ formats, path, mime });
  return format;
};

const finders = {
  payload: findByMime,
  conf: findByExt,
  db: findByExt,
};

module.exports = {
  findFormat,
};
