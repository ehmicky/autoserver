'use strict';

const { cwd } = require('process');
const { resolve, isAbsolute } = require('path');

const { throwError } = require('../../../errors');
const { pReaddir } = require('../../../utilities');
const { findByExt, isRawFormat } = require('../../../formats');

// Retrieves final config path to use
const getConfPath = async function ({ envConfigPath, configPath }) {
  const path = envConfigPath || configPath;

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
  const pathA = paths.find(path => CONFIG_REGEXP.test(path));

  // Found a file
  if (pathA !== undefined) {
    return resolve(dir, pathA);
  }

  const parentDir = resolve(dir, '..');

  // Reached root directory
  if (parentDir === dir) { return; }

  return findConfPath(parentDir);
};

const CONFIG_REGEXP = /^apiengine.config.[a-z]+$/;

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
  throwError(message, { reason: 'CONFIG_VALIDATION' });
};

const validatePath = function ({ path }) {
  if (path === undefined) {
    const message = 'No config file was found';
    throwError(message, { reason: 'CONFIG_VALIDATION' });
  }

  const format = findByExt({ path });

  if (isRawFormat({ format })) {
    const message = `The file format of the config file is not supported: '${path}'`;
    throwError(message, { reason: 'CONFIG_VALIDATION' });
  }
};

module.exports = {
  getConfPath,
};
