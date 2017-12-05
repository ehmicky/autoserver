'use strict';

const { omitBy } = require('../utilities');
const { getVars } = require('../schema_func');

// Retrieves information sent to event, and message printed to console
const getPayload = function ({
  schema,
  mInput = { schema },
  type,
  phase,
  level,
  message,
  info,
  vars,
}) {
  const requestinfo = getVars(mInput, { vars });

  const eventPayload = {
    ...info,
    ...vars,
    type,
    phase,
    level,
    message,
    ...requestinfo,
  };
  const eventPayloadA = omitBy(eventPayload, value => value === undefined);

  return eventPayloadA;
};

module.exports = {
  getPayload,
};
