'use strict';

const { dirname } = require('path');

const { addErrorHandler } = require('../error');
const { getConfFile, loadConfFile } = require('../conf');
const { reduceAsync, get, set, findValueAsync } = require('../utilities');

// Load options being a path pointing to a config file, inside the main
// config file, i.e. to a "sub-conf" file
const loadSubConfPaths = async function ({
  options,
  optionsFile,
  availableOpts,
}) {
  const subConfOpts = getSubConfOpts({ availableOpts });
  const baseDir = getBaseDir({ optionsFile });
  const optionsB = await loadSubConfOpts({ subConfOpts, options, baseDir });

  return { options: optionsB };
};

const getSubConfOpts = function ({ availableOpts }) {
  return availableOpts.options
    .filter(({ subConfFiles }) => subConfFiles !== undefined);
};

// Config paths, inside a main config files, are relative to that file
const getBaseDir = function ({ optionsFile }) {
  if (!optionsFile) { return; }

  return dirname(optionsFile);
};

const loadSubConfOpts = function ({ subConfOpts, options, baseDir }) {
  return reduceAsync(
    subConfOpts,
    (optionsA, subConfOpt) =>
      eLoadSubConfOpt({ options: optionsA, baseDir, subConfOpt }),
    options,
  );
};

const loadSubConfOpt = async function ({
  baseDir,
  options,
  subConfOpt: { name, subConfFiles },
}) {
  const keys = name.split('.');
  const path = get(options, keys);

  const content = await loadSubConfFiles({ baseDir, path, subConfFiles });

  const optionsA = set(options, keys, () => content);
  return optionsA;
};

const eLoadSubConfOpt = addErrorHandler(loadSubConfOpt, {
  message: ({ configOpt: { name } }) => `Could not load option '${name}'`,
  reason: 'CONF_LOADING',
});

const loadSubConfFiles = function ({ baseDir, path, subConfFiles }) {
  return findValueAsync(
    subConfFiles,
    subConfFile => loadSubConfFile({ baseDir, path, subConfFile }),
  );
};

const loadSubConfFile = async function ({
  baseDir,
  path,
  subConfFile: { filename, extNames, loader },
}) {
  const pathA = await getConfFile({ path, name: filename, baseDir, extNames });
  if (!pathA) { return; }

  const loadedFile = await loadConfFile({ type: loader, path: pathA });
  return loadedFile;
};

module.exports = {
  loadSubConfPaths,
};
