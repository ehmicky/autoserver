'use strict';

const { EVENTS, LEVELS } = require('../../constants');

// Retrieves `[EVENT] [LEVEL] [PROCESSNAME] [TIMESTAMP] [PHASE]`
const getPrefix = function ({ log }) {
  return PREFIXES
    .map(({ value, length }) => getEachPrefix({ value, length, log }))
    .join(' ');
};

const getEachPrefix = function ({ value, length, log }) {
  const prefix = value(log);
  const prefixA = prefix
    .substr(0, length)
    .padEnd(length);
  const prefixB = `[${prefixA}]`;
  return prefixB;
};

const getMaxLength = function (enumVal) {
  const lengths = enumVal.map(({ length }) => length);
  return Math.max(...lengths);
};

const PREFIXES = [
  {
    value: ({ event }) => event.toUpperCase(),
    length: getMaxLength(EVENTS),
  },

  {
    value: ({ level }) => level.toUpperCase(),
    length: getMaxLength(LEVELS),
  },

  {
    value: ({ serverinfo: { process: { name: processName } } }) => processName,
    length: 12,
  },

  {
    value: ({ serverinfo: { host: { id: hostId } } }) => hostId,
    length: 8,
  },

  {
    value: ({ serverinfo: { process: { id: processId } } }) =>
      String(processId),
    length: 5,
  },

  {
    value: ({ timestamp }) =>
      timestamp.replace('T', ' ').replace(/(\d)Z$/, '$1'),
    length: 23,
  },

  {
    value: ({ phase, requestid }) => requestid || phase.toUpperCase(),
    length: 8,
  },
];

module.exports = {
  getPrefix,
};
