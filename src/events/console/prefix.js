'use strict';

const { TYPES, LEVELS } = require('../constants');

// Retrieves `[TYPE] [LEVEL] [PROCESSNAME] [TIMESTAMP] [PHASE]`
const getPrefix = function ({ vars }) {
  return PREFIXES
    .map(({ value, length }) => getEachPrefix({ value, length, vars }))
    .join(' ');
};

const getEachPrefix = function ({ value, length, vars }) {
  const prefix = value(vars);
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
    value: ({ type }) => type.toUpperCase(),
    length: getMaxLength(TYPES),
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
    value: ({ serverinfo: { process: { id: processId } } }) => processId,
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
