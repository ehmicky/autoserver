'use strict';


const { TYPES, LEVELS } = require('./constants');


// Build a standardized log message:
// [TYPE] [LEVEL] [TIMESTAMP] [PHASE] MESSAGE - SUBMESSAGE
//   STACK_TRACE
// `PHASE` is requestId if phase is `request`
const getMessage = function ({
  phase,
  type,
  level,
  timestamp,
  requestId,
  rawMessage,
}) {
  const prefix = getPrefix({ phase, type, level, timestamp, requestId });
  const message = `${prefix} ${rawMessage}`;
  return message;
};

// Retrieves `[TYPE] [LEVEL] [TIMESTAMP] [PHASE]`
const getPrefix = function ({ phase, type, level, timestamp, requestId }) {
  const prefixes = [
    getType({ type }),
    getLevel({ level }),
    getTimestamp({ timestamp }),
    getRequestId({ phase, requestId }),
  ];
  const prefix = prefixes.map(val => `[${val}]`).join(' ');
  return prefix;
};

const getType = function ({ type }) {
  return type.toUpperCase().padEnd(typesMaxLength);
};
const typesMaxLength = Math.max(...TYPES.map(type => type.length));

const getLevel = function ({ level }) {
  return level.toUpperCase().padEnd(levelsMaxLength);
};
const levelsMaxLength = Math.max(...LEVELS.map(level => level.length));

const getTimestamp = function ({ timestamp }) {
  return timestamp.replace('T', ' ').replace(/([0-9])Z$/, '$1');
};

// Either requestId (if phase `request`), or the phase itself
const getRequestId = function ({ phase, requestId = phase.toUpperCase() }) {
  return requestId.substr(0, 8).padEnd(requestIdLength);
};
const requestIdLength = 8;


module.exports = {
  getMessage,
};
