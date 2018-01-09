'use strict';

const { pReadFile, pWriteFile } = require('../utilities');

const { parseContent, serializeContent } = require('./content');

// Loads any of the supported formats
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const parseFile = async function (format, path, { compat }) {
  const content = await pReadFile(path, { encoding: 'utf-8' });

  const contentA = parseContent(format, content, { path, compat });
  return contentA;
};

// Persist file, using any of the supported formats
const serializeFile = async function (format, path, content) {
  const contentA = serializeContent(format, content);

  const contentB = await pWriteFile(path, contentA, { encoding: 'utf-8' });
  return contentB;
};

module.exports = {
  parseFile,
  serializeFile,
};
