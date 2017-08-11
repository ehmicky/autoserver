'use strict';

const { resolve, isAbsolute } = require('path');

const { mapValues } = require('../utilities');
const { throwError } = require('../error');

// Transform events options from full paths to loaded file, using require()
const loadEventsOptsFile = function ({ runtimeOpts, runtimeOpts: { events } }) {
  if (!events) { return runtimeOpts; }

  const eventsA = mapValues(
    events,
    (path, name) => loadEventFile({ path, name }),
  );

  return { runtimeOpts: { ...runtimeOpts, events: eventsA } };
};

const loadEventFile = function ({ path, name }) {
  if (!path) { return; }

  try {
    // E.g. when passed as an environment variable, the file will still be
    // relative
    const pathA = isAbsolute(path) ? path : resolve(process.cwd(), path);

    // eslint-disable-next-line import/no-dynamic-require
    return require(pathA);
  } catch (error) {
    const message = `Could not find event '${name}' file '${path}'`;
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

module.exports = {
  loadEventsOptsFile,
};
