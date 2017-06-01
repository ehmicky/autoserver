'use strict';


const { colorize } = require('./colorize');
const { TYPES, LEVELS } = require('./constants');


const getMessage = function ({
  type,
  level,
  timestamp,
  requestId,
  rawMessage,
}) {
  const prefix = getPrefix({ type, level, timestamp, requestId });
  const message = `${prefix} ${rawMessage}`;
  const colorMessage = colorize(level, message);
  return colorMessage;
};

const getPrefix = function ({ type, level, timestamp, requestId }) {
  const prefixes = [
    getPrefixType(type),
    getPrefixLevel(level),
    getPrefixTimestamp(timestamp),
    getPrefixRequestId(requestId),
  ];
  const prefix = prefixes.map(val => `[${val}]`).join(' ');
  return prefix;
};

const getPrefixType = function (type) {
  return type.toUpperCase().padEnd(typesMaxLength);
};
const typesMaxLength = Math.max(...TYPES.map(type => type.length));

const getPrefixLevel = function (level) {
  return level.toUpperCase().padEnd(levelsMaxLength);
};
const levelsMaxLength = Math.max(...LEVELS.map(level => level.length));

const getPrefixTimestamp = function (timestamp) {
  return timestamp.replace('T', ' ').replace(/([0-9])Z$/, '$1');
};

const getPrefixRequestId = function (requestId) {
  return requestId.substr(0, 8).padEnd(requestIdLength);
};
const requestIdLength = 8;


module.exports = {
  getMessage,
};
