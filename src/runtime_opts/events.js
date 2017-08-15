'use strict';

const { dirname } = require('path');

const { throwError } = require('../error');
const { getConfFile } = require('../conf');
const { mapValues, mapValuesAsync } = require('../utilities');

// Load configuration for runtimeOpts `events`
const loadEventsOptsFile = async function ({
  runtimeOpts,
  runtimeOpts: { events },
  runtimeOptsFile,
}) {
  if (!events || events.constructor !== Object) { return { runtimeOpts }; }

  const baseDir = getBaseDir({ runtimeOptsFile });
  const eventsA = await mapValuesAsync(
    events,
    (path, name) => eResolveEventPath({ path, name, baseDir }),
  );
  const eventsB = mapValues(
    eventsA,
    (path, name) => eLoadEventFile({ path, name }),
  );

  return { runtimeOpts: { ...runtimeOpts, events: eventsB } };
};

// Event paths, inside a runtime options files, are relative to that file
const getBaseDir = function ({ runtimeOptsFile }) {
  if (!runtimeOptsFile) { return; }

  return dirname(runtimeOptsFile);
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

const addErrorHandler = function (func) {
  return ({ path, name, ...rest }) => {
    try {
      return func({ path, name, ...rest });
    } catch (error) {
      const message = `Could not load event '${name}' file '${path}'`;
      throwError(message, { reason: 'CONF_LOADING', innererror: error });
    }
  };
};

const eResolveEventPath = addErrorHandler(resolveEventPath);
const eLoadEventFile = addErrorHandler(loadEventFile);

module.exports = {
  loadEventsOptsFile,
};
