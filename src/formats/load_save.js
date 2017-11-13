'use strict';

const { pReadFile, pWriteFile } = require('../utilities');

const { findFormat } = require('./find');
const { parse, serialize } = require('./parse_serialize');

// Loads any of the supported formats
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const loadFile = async function ({ type, path }) {
  const { name } = findFormat({ type, path });

  const contentA = await pReadFile(path, { encoding: 'utf-8' });

  return parse({ format: name, path, content: contentA });
};

// Persist file, using any of the supported formats
const saveFile = function ({ type, path, content }) {
  const { name } = findFormat({ type, path });

  const contentA = serialize({ format: name, content });

  return pWriteFile(path, contentA, { encoding: 'utf-8' });
};

module.exports = {
  loadFile,
  saveFile,
};
