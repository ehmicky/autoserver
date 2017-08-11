'use strict';

const { dirname } = require('path');

const { throwError } = require('../error');
const { getConf } = require('../conf');
const { assignObject, mapValuesAsync } = require('../utilities');
const { TYPES } = require('../events');

// Load configuration for runtimeOpts `events`
const resolveEventsOptsFile = async function ({
  runtimeOpts,
  runtimeOptsFile,
}) {
  const events = getEventsPaths({ runtimeOpts });
  const eventsA = await mapValuesAsync(
    events,
    (path, name) => resolveEventPath({ path, name, runtimeOptsFile }),
  );

  return { runtimeOpts: { ...runtimeOpts, events: eventsA } };
};

// Retrieve `runtimeOpts.events`, adding all types as undefined if not defined
const getEventsPaths = function ({ runtimeOpts: { events } }) {
  const eventsA = events && events.constructor === Object ? events : {};
  const eventsB = [...TYPES, 'any']
    .map(type => ({ [type]: eventsA[type] }))
    .reduce(assignObject, {});
  return eventsB;
};

// Resolve relative event paths, or missing event paths (by walking up the tree)
const resolveEventPath = async function ({ path, name, runtimeOptsFile }) {
  try {
    // Event paths, inside a runtime options files, are relative to that file
    const baseDir = runtimeOptsFile && dirname(runtimeOptsFile);
    const fullPath = await getConf({
      path,
      name: `event.${name}`,
      baseDir,
      extNames: ['js'],
    });
    return fullPath;
  } catch (error) {
    const message = `Could not load event '${name}' file '${path}'`;
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

module.exports = {
  resolveEventsOptsFile,
};
