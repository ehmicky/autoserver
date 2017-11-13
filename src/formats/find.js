'use strict';

const { extname } = require('path');

const { is: isType } = require('type-is');

const formats = require('./handlers');

// Retrieve correct format, using MIME type
const findFormatByMime = function ({ mime }) {
  return formats.find(({ mimes = [] }) => isType(mime, mimes));
};

// Retrieve correct format, using file extension
// Defaults to JSON
const findFormatByExt = function ({ path }) {
  const fileExt = extname(path).slice(1);
  const formatA = formats
    .find(({ extNames: exts = [] }) => exts.includes(fileExt));

  if (formatA === undefined) { return formats[0]; }

  return formatA;
};

module.exports = {
  findFormatByMime,
  findFormatByExt,
};
