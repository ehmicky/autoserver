'use strict';

const { pReadFile, pWriteFile } = require('../utilities');

const formats = require('./handlers');
const { findFormatByExt } = require('./find');

// Loads any of the supported formats
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const load = async function ({ format: { parse }, path, content }) {
  const contentA = await getContent({ path, content });

  return parse({ path, content: contentA });
};

const getContent = function ({ path, content }) {
  if (content !== undefined) { return content; }

  return pReadFile(path, { encoding: 'utf-8' });
};

// Defaults to JSON
const loadByExt = function ({ path, content }) {
  const format = findFormatByExt({ path }) || formats[0];
  return load({ format, path, content });
};

// Persist file, using any of the supported formats
const save = function ({ format: { serialize }, path, content }) {
  const contentA = serialize({ content });

  return pWriteFile(path, contentA, { encoding: 'utf-8' });
};

// Defaults to JSON
const saveByExt = function ({ path, content }) {
  const format = findFormatByExt({ path }) || formats[0];
  return save({ format, path, content });
};

module.exports = {
  loadByExt,
  saveByExt,
};
