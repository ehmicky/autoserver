'use strict';

const { throwCommonError } = require('../../error');

// Check if any model already exists, for create actions
const validateCreateIds = function ({
  response: { data },
  command,
  top: { command: { type: topCommand } },
  clientCollname,
}) {
  const isCreateCurrentData = topCommand === 'create' && command === 'find';
  if (!isCreateCurrentData) { return; }

  if (data.length === 0) { return; }

  const ids = data.map(({ id }) => id);
  throwCommonError({ reason: 'MODEL_CONFLICT', ids, clientCollname });
};

module.exports = {
  validateCreateIds,
};
