'use strict';

const { pReadFile, pWriteFile } = require('../utilities');

const { findFormatByExt } = require('./find');

// Loads any of the supported formats
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const load = async function ({ format: { parse }, path }) {
  const contentA = await pReadFile(path, { encoding: 'utf-8' });

  return parse({ path, content: contentA });
};

// Persist file, using any of the supported formats
const save = function ({ format: { serialize }, path, content }) {
  const contentA = serialize({ content });

  return pWriteFile(path, contentA, { encoding: 'utf-8' });
};

// Defaults to JSON
const loadByExt = function ({ path, content }) {
  const format = findFormatByExt({ path });
  return load({ format, path, content });
};

// Defaults to JSON
const saveByExt = function ({ path, content }) {
  const format = findFormatByExt({ path });
  return save({ format, path, content });
};

module.exports = {
  loadByExt,
  saveByExt,
};
