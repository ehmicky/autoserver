'use strict';

const { getWordsList } = require('../../utilities');
const { throwError } = require('../../error');
const { extractSimpleIds } = require('../../database');

// Check if any `id` was not found (404)
const validateMissingIds = function ({
  command,
  response: { data },
  args: { filter = {} },
}) {
  if (command !== 'find') { return; }

  const filterIds = extractSimpleIds({ filter });
  // Can be checked only when filtering only by `id`
  // In particular, complex `args.filter` won't be checked
  if (filterIds === undefined) { return; }

  const responseIds = data.map(model => model && model.id);
  const missingIds = filterIds.filter(id => !responseIds.includes(id));

  checkMissingIds({ missingIds });
};

const checkMissingIds = function ({ missingIds }) {
  if (missingIds.length === 0) { return; }

  const missingIdsA = getWordsList(missingIds, { op: 'nor', quotes: true });
  const message = `Could not find any model with an 'id' equal to ${missingIdsA}`;
  throwError(message, { reason: 'DB_MODEL_NOT_FOUND' });
};

module.exports = {
  validateMissingIds,
};
