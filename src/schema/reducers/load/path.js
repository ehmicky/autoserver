'use strict';

const { cwd } = require('process');
const { resolve, isAbsolute } = require('path');

const { throwError } = require('../../../error');
const { pReaddir } = require('../../../utilities');
const { findFormat } = require('../../../formats');

// Retrieves final configuration path to use
const getConfPath = async function ({ envSchemaPath, schemaPath }) {
  const path = envSchemaPath || schemaPath;

  const pathA = await getPath({ path });

  validatePath({ path: pathA });

  return pathA;
};

const getPath = function ({ path }) {
  const baseDir = cwd();

  if (path === undefined) {
    return findConfPath(baseDir);
  }

  return resolvePath({ path, baseDir });
};

// Try to find apiengine.config.EXT in current directory, or any parent
const findConfPath = async function (dir) {
  const paths = await pReaddir(dir);
  const path = paths.find(isConfPath);

  // Found a file
  if (path !== undefined) {
    return resolve(dir, path);
  }

  const parentDir = resolve(dir, '..');

  // Reached root directory
  if (parentDir === dir) { return; }

  return findConfPath(parentDir);
};

const isConfPath = function (path) {
  return path.startsWith(APIENGINE_CONFIG_PATH);
};

const APIENGINE_CONFIG_PATH = 'apiengine.config.';

// When `config` option or environment variable is used
const resolvePath = function ({ path, baseDir }) {
  validateConfig({ path });

  if (isAbsolute(path)) { return path; }

  const pathA = resolve(baseDir, path);
  return pathA;
};

const validateConfig = function ({ path }) {
  if (typeof path === 'string') { return; }

  const message = `'config' option must be a string, not '${path}'`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

const validatePath = function ({ path }) {
  if (path === undefined) {
    const message = 'No configuration file was found';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  const format = findFormat({ type: 'conf', path });

  if (format === undefined) {
    const message = `The file format of the configuration file is not supported: '${path}'`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

module.exports = {
  getConfPath,
};
