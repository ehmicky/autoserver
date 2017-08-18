'use strict';

const { dirname } = require('path');

const { addErrorHandler } = require('../error');
const { getConfFile } = require('../conf');
const { mapValues, mapValuesAsync } = require('../utilities');

// Load configuration for options `events`
const loadEventsOptsFile = async function ({
  options,
  options: { events },
  optionsFile,
  command,
}) {
  const hasEvents = command === 'run' &&
    events &&
    events.constructor === Object;
  if (!hasEvents) { return { options }; }

  const baseDir = getBaseDir({ optionsFile });
  const eventsA = await mapValuesAsync(
    events,
    (path, name) => eResolveEventPath({ path, name, baseDir }),
  );
  const eventsB = mapValues(
    eventsA,
    (path, name) => eLoadEventFile({ path, name }),
  );

  return { options: { ...options, events: eventsB } };
};

// Event paths, inside an options files, are relative to that file
const getBaseDir = function ({ optionsFile }) {
  if (!optionsFile) { return; }

  return dirname(optionsFile);
};

// Resolve relative event paths, or missing event paths (by walking up the tree)
const resolveEventPath = async function ({ path, name, baseDir }) {
  const fullPath = await getConfFile({
    path,
    name: `event.${name}`,
    baseDir,
    extNames: ['js'],
  });
  return fullPath;
};

// Transform events options from full paths to loaded file, using require()
const loadEventFile = function ({ path }) {
  if (!path) { return; }

  // eslint-disable-next-line import/no-dynamic-require
  return require(path);
};

const errorHandlerArg = {
  message: ({ name, path }) => `Could not load event '${name}' file '${path}'`,
  reason: 'CONF_LOADING',
};

const eResolveEventPath = addErrorHandler(resolveEventPath, errorHandlerArg);

const eLoadEventFile = addErrorHandler(loadEventFile, errorHandlerArg);

module.exports = {
  loadEventsOptsFile,
};
