'use strict';

const { omitBy } = require('../utilities');
const { getStandardError } = require('../error');
const { getServerinfo } = require('../server_info');
const { getVars } = require('../schema_func');

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
  const requestinfo = getVars(mInput);

  const { serverinfo } = getServerinfo({ schema });

  const eventPayload = {
    ...info,
    type,
    phase,
    level,
    message,
    ...requestinfo,
    error: errorA,
    serverinfo,
  };
  const eventPayloadA = omitBy(eventPayload, value => value === undefined);

  return eventPayloadA;
};

module.exports = {
  getPayload,
};
