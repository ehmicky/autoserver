'use strict';

const { omitBy } = require('../utilities');
const { getStandardError } = require('../error');
const { getServerinfo } = require('../server_info');

const { getRequestinfo } = require('./request_info');
const { getConsoleMessage } = require('./console');

// Retrieves information sent to event, and message printed to console
const getPayload = function ({
  mInput,
  errorinfo,
  type,
  phase,
  level,
  message,
  runOpts,
  schema,
  duration,
  info,
}) {
  const eventPayload = getEventPayload({
    mInput,
    errorinfo,
    type,
    phase,
    level,
    runOpts,
    schema,
    info,
  });
  const messageA = getConsoleMessage({ message, duration, ...eventPayload });
  const eventPayloadA = { ...eventPayload, message: messageA };

  return { eventPayload: eventPayloadA, message: messageA };
};

// Event information sent to handlers
const getEventPayload = function ({
  mInput,
  errorinfo,
  runOpts,
  schema,
  type,
  phase,
  level,
  info = {},
}) {
  const errorinfoA = getStandardError({ error: errorinfo, mInput });
  const requestinfo = getRequestinfo({ mInput, phase, runOpts });

  const timestamp = getTimestamp({ requestinfo });

  const { serverinfo } = getServerinfo({ schema });

  const eventPayload = {
    ...info,
    type,
    phase,
    level,
    requestinfo,
    errorinfo: errorinfoA,
    timestamp,
    serverinfo,
  };
  const eventPayloadA = omitBy(eventPayload, value => value === undefined);

  return eventPayloadA;
};

// Reuse the request timestamp if possible
const getTimestamp = function ({ requestinfo: { timestamp } = {} }) {
  if (!timestamp) {
    return (new Date()).toISOString();
  }

  return timestamp;
};

module.exports = {
  getPayload,
};
