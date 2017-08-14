'use strict';

const { getServerInfo } = require('../../info');

const { getRequestInfo } = require('./request_info');

// Event information sent to handlers
const getEventPayload = function ({
  log,
  runtimeOpts,
  type,
  phase,
  level,
  info = {},
  info: { errorInfo } = {},
}) {
  const {
    requestInfo,
    // In a request, errorInfo is trimmed. Otherwise, keep it as is
    errorInfo: errorInfoA = errorInfo,
  } = getRequestInfo({ log, phase, runtimeOpts, errorInfo });

  const timestamp = getTimestamp({ requestInfo });

  const serverInfo = getServerInfo({ runtimeOpts });

  return {
    ...info,
    type,
    phase,
    level,
    requestInfo,
    errorInfo: errorInfoA,
    timestamp,
    serverInfo,
  };
};

// Reuse the request timestamp if possible
const getTimestamp = function ({ requestInfo: { timestamp } = {} }) {
  if (!timestamp) {
    return (new Date()).toISOString();
  }

  return timestamp;
};

module.exports = {
  getEventPayload,
};
