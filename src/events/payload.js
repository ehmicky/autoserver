'use strict';

const { getVars } = require('../schema_func');

// Retrieves information sent to event, and message printed to console
const getPayload = function ({
  schema,
  mInput = { schema },
  type,
  phase,
  level,
  message,
  vars,
}) {
  const varsA = getVars(mInput, { vars });

  const eventPayload = {
    type,
    phase,
    level,
    message,
    ...varsA,
  };
  return eventPayload;
};

module.exports = {
  getPayload,
};
