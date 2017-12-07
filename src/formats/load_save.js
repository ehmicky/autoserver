'use strict';

const { pReadFile, pWriteFile } = require('../utilities');
const { throwError } = require('../error');

const { findFormat } = require('./find');
const { parse, serialize } = require('./parse_serialize');

// Loads any of the supported formats
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const loadFile = async function ({ type, path, allow }) {
  const format = getFormat({ type, path });

  const contentA = await pReadFile(path, { encoding: 'utf-8' });

  return parse({ format: format.name, path, content: contentA, allow });
};

// Persist file, using any of the supported formats
const saveFile = function ({ type, path, content, allow }) {
  const format = getFormat({ type, path });

  const contentA = serialize({ format: format.name, content, allow });

  return pWriteFile(path, contentA, { encoding: 'utf-8' });
};

const getFormat = function ({ type, path }) {
  const format = findFormat({ type, path });
  if (format !== undefined) { return format; }

  const message = `Invalid file format: ${path}`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  loadFile,
  saveFile,
};
