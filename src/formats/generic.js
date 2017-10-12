'use strict';

const { extname } = require('path');

const {
  pReadFile,
  pWriteFile,
  assignArray,
  getWordsList,
} = require('../utilities');

const formats = require('./handlers');

// Loads either JSON or YAML file.
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const load = async function ({ path, content }) {
  const contentA = await getContent({ path, content });

  const { parse } = getFormat({ path });
  return parse({ path, content: contentA });
};

const getContent = function ({ path, content }) {
  if (content !== undefined) { return content; }

  return pReadFile(path, { encoding: 'utf-8' });
};

// Saves to either JSON or YAML file
const save = function ({ path, content }) {
  const { serialize } = getFormat({ path });

  const contentA = serialize({ content });

  return pWriteFile(path, contentA, { encoding: 'utf-8' });
};

// Retrieve correct format, using file extension
const getFormat = function ({ path }) {
  const fileExt = extname(path).slice(1);
  const format = formats.find(({ extNames }) => extNames.includes(fileExt));

  // Default format
  if (format === undefined) { return formats[0]; }

  return format;
};

const getGeneric = function () {
  const extNames = formats
    .map(format => format.extNames)
    .reduce(assignArray, []);

  const titles = formats.map(({ title }) => title);
  const description = getWordsList(titles);

  return { load, save, extNames, description };
};

const generic = getGeneric();

module.exports = {
  generic,
};
