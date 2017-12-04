'use strict';

const { omitBy } = require('../utilities');
const { getStandardError } = require('../error');
const { getServerinfo } = require('../server_info');

const { getRequestinfo } = require('./request_info');

// Retrieves information sent to event, and message printed to console
const getPayload = function ({
  mInput,
  error,
  schema,
  type,
  phase,
  level,
  message,
  info = {},
}) {
  const errorA = getStandardError({ error, mInput });
  const requestinfo = getRequestinfo({ mInput, phase });

  const timestamp = getTimestamp({ requestinfo });

  const { serverinfo } = getServerinfo({ schema });

  const eventPayload = {
    ...info,
    type,
    phase,
    level,
    message,
    ...requestinfo,
    error: errorA,
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
