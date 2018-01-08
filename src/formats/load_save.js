'use strict';

const { pReadFile, pWriteFile } = require('../utilities');
const { addGenErrorHandler } = require('../errors');

const { findByExt } = require('./find');
const { parse, serialize } = require('./parse_serialize');

// Loads any of the supported formats
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const loadFile = async function ({ path, safe, compat }) {
  const content = await eReadFile(path, { encoding: 'utf-8' });

  const format = findByExt({ path, safe });
  const contentA = parse({ format, path, content, compat });
  return contentA;
};

const eReadFile = addGenErrorHandler(pReadFile, {
  message: ({ path }) => `Could not read file '${path}'`,
  reason: 'CONFIG_RUNTIME',
});

// Persist file, using any of the supported formats
const saveFile = async function ({ path, content, safe }) {
  const format = findByExt({ path, safe });
  const contentA = serialize({ format, content });

  const contentB = await eWriteFile(path, contentA, { encoding: 'utf-8' });
  return contentB;
};

const eWriteFile = addGenErrorHandler(pWriteFile, {
  message: ({ path }) => `Could not write file '${path}'`,
  reason: 'CONFIG_RUNTIME',
});

module.exports = {
  loadFile,
  saveFile,
};
