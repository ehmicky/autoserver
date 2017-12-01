'use strict';

const { TYPES, LEVELS } = require('../constants');

// Retrieves `[TYPE] [LEVEL] [PROCESSNAME] [TIMESTAMP] [PHASE]`
const getPrefix = function ({
  type,
  phase,
  level,
  timestamp,
  requestinfo: { requestid } = {},
  serverinfo: { host: { id: hostId }, process: { name: processName } },
}) {
  const prefixes = [
    getType({ type }),
    getLevel({ level }),
    getProcessName({ processName }),
    getHostId({ hostId }),
    getTimestamp({ timestamp }),
    getRequestid({ phase, requestid }),
  ];
  const prefix = prefixes.map(val => `[${val}]`).join(' ');
  return prefix;
};

const getType = function ({ type }) {
  return type
    .toUpperCase()
    .padEnd(TYPES_MAX_LENGTH);
};

const TYPES_MAX_LENGTH = Math.max(...TYPES.map(type => type.length));

const getLevel = function ({ level }) {
  return level
    .toUpperCase()
    .padEnd(LEVELS_MAX_LENGTH);
};

const LEVELS_MAX_LENGTH = Math.max(...LEVELS.map(level => level.length));

const getProcessName = function ({ processName }) {
  return processName
    .substr(0, PROCESSNAME_LENGTH)
    .padEnd(PROCESSNAME_LENGTH);
};

const PROCESSNAME_LENGTH = 12;

const getHostId = function ({ hostId }) {
  return hostId
    .substr(0, HOSTID_LENGTH)
    .padEnd(HOSTID_LENGTH);
};

const HOSTID_LENGTH = 8;

const getTimestamp = function ({ timestamp }) {
  return timestamp.replace('T', ' ').replace(/(\d)Z$/, '$1');
};

// Either requestid (if phase `request`), or the phase itself
const getRequestid = function ({ phase, requestid = phase.toUpperCase() }) {
  return requestid
    .substr(0, REQUESTID_LENGTH)
    .padEnd(REQUESTID_LENGTH);
};

const REQUESTID_LENGTH = 8;

module.exports = {
  getPrefix,
};
