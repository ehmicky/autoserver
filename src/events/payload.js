'use strict';

const { omitBy } = require('../utilities');
const { getServerInfo } = require('../info');

const { getRequestInfo } = require('./request_info');
const { getConsoleMessage } = require('./console');

// Retrieves information sent to event, and message printed to console
const getPayload = function ({
  reqInfo,
  errorInfo,
  type,
  phase,
  level,
  message,
  runtimeOpts,
  info,
}) {
  const eventPayload = getEventPayload({
    reqInfo,
    errorInfo,
    type,
    phase,
    level,
    runtimeOpts,
    info,
  });
  const messageA = getConsoleMessage({ message, ...eventPayload });
  const eventPayloadA = { ...eventPayload, message: messageA };

  return { eventPayload: eventPayloadA, message: messageA };
};

// Event information sent to handlers
const getEventPayload = function ({
  reqInfo,
  errorInfo,
  runtimeOpts,
  type,
  phase,
  level,
  info = {},
}) {
  const {
    requestInfo,
    errorInfo: errorInfoA,
  } = getRequestInfo({ reqInfo, phase, runtimeOpts, errorInfo });

  const timestamp = getTimestamp({ requestInfo });

  const serverInfo = getServerInfo({ runtimeOpts });

  const eventPayload = {
    ...info,
    type,
    phase,
    level,
    requestInfo,
    errorInfo: errorInfoA,
    timestamp,
    serverInfo,
  };
  const eventPayloadA = omitBy(eventPayload, value => value === undefined);

  return eventPayloadA;
};

// Reuse the request timestamp if possible
const getTimestamp = function ({ requestInfo: { timestamp } = {} }) {
  if (!timestamp) {
    return (new Date()).toISOString();
  }

  return timestamp;
};

module.exports = {
  getPayload,
};
