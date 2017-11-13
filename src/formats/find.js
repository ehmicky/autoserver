'use strict';

const { extname } = require('path');

const { is: isType } = require('type-is');

const allFormats = require('./handlers');

// Retrieve correct format, using MIME type
const findByMime = function ({ formats, mime }) {
  const format = formats.find(({ mimes = [] }) => isType(mime, mimes));

  // Means this is not a structured type, like media types,
  // and unlike JSON or YAML
  // This won't be parsed (i.e. returned as is), and will use 'binary' charset
  if (format === undefined) {
    return { title: mime };
  }

  return format;
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
