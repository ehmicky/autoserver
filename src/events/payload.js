'use strict';

const { omitBy } = require('../utilities');
const { getStandardError } = require('../error');
const { getVars } = require('../schema_func');

// Retrieves information sent to event, and message printed to console
const getPayload = function ({
  schema,
  mInput = { schema },
  error,
  type,
  phase,
  level,
  message,
  info = {},
}) {
  const errorA = getStandardError({ error, mInput });
  const requestinfo = getVars(mInput);

  const eventPayload = {
    ...info,
    type,
    phase,
    level,
    message,
    ...requestinfo,
    error: errorA,
  };
  const eventPayloadA = omitBy(eventPayload, value => value === undefined);

  return eventPayloadA;
};

module.exports = {
  getPayload,
};
