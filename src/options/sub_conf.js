'use strict';

const { dirname } = require('path');

const { addErrorHandler } = require('../error');
const { reduceAsync, get, set, findValueAsync } = require('../utilities');

const { getConfFile, loadConfFile } = require('./conf');

// Load options being a path pointing to a config file, inside the main
// config file, i.e. to a "sub-conf" file
const loadSubConf = async function ({
  command,
  options,
  optionsFile,
  availableOpts,
}) {
  const subConfOpts = getSubConfOpts({ availableOpts });
  const baseDir = getBaseDir({ optionsFile });
  const optionsB = await loadSubConfOpts({
    command,
    baseDir,
    subConfOpts,
    options,
  });

  return { options: optionsB };
};

const getSubConfOpts = function ({ availableOpts }) {
  return availableOpts
    .filter(({ subConfFiles }) => subConfFiles !== undefined);
};

// Config paths, inside a main config files, are relative to that file
const getBaseDir = function ({ optionsFile }) {
  if (!optionsFile) { return; }

  return dirname(optionsFile);
};

const loadSubConfOpts = function ({ command, baseDir, subConfOpts, options }) {
  return reduceAsync(
    subConfOpts,
    (optionsA, subConfOpt) =>
      eLoadSubConfOpt({ command, baseDir, options: optionsA, subConfOpt }),
    options,
  );
};

const loadSubConfOpt = async function ({
  command,
  baseDir,
  options,
  subConfOpt: { name, subConfFiles },
}) {
  const keys = name.split('.');
  const path = get(options, keys);

  const content = await loadSubConfFiles({
    command,
    baseDir,
    path,
    subConfFiles,
  });

  const optionsA = set(options, keys, () => content);
  return optionsA;
};

const eLoadSubConfOpt = addErrorHandler(loadSubConfOpt, {
  message: ({ subConfOpt: { name } }) => `Could not load option '${name}'`,
  reason: 'CONF_LOADING',
});

const loadSubConfFiles = function ({ command, baseDir, path, subConfFiles }) {
  return findValueAsync(
    subConfFiles,
    subConfFile => loadSubConfFile({ command, baseDir, path, subConfFile }),
  );
};

const loadSubConfFile = async function ({
  command,
  baseDir,
  path,
  subConfFile: { filename, extNames, loader },
}) {
  const name = `${command}.${filename}`;
  const pathA = await getConfFile({ path, name, baseDir, extNames });
  if (!pathA) { return; }

  const loadedFile = await loadConfFile({ type: loader, path: pathA });
  return loadedFile;
};

module.exports = {
  loadSubConf,
};
