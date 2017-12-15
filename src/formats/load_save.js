'use strict';

const { pReadFile, pWriteFile } = require('../utilities');

const { findByExt } = require('./find');
const { parse, serialize } = require('./parse_serialize');

// Loads any of the supported formats
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const loadFile = async function ({ path, safe, compat }) {
  const content = await pReadFile(path, { encoding: 'utf-8' });

  const format = findByExt({ path, safe });
  const contentA = parse({ format: format.name, path, content, compat });
  return contentA;
};

// Persist file, using any of the supported formats
const saveFile = async function ({ path, content, safe }) {
  const format = findByExt({ path, safe });
  const contentA = serialize({ format: format.name, content });

  const contentB = await pWriteFile(path, contentA, { encoding: 'utf-8' });
  return contentB;
};

module.exports = {
  loadFile,
  saveFile,
};
