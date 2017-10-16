'use strict';

const { getWordsList } = require('../../../../utilities');
const { throwError } = require('../../../../error');

// Check if any `id` was not found (404)
const validateMissingIds = function ({ dbData, filterIds }) {
  // Can be checked only when filtering only by `id`
  if (filterIds === undefined) { return; }

  // eslint-disable-next-line no-underscore-dangle
  const dbDataIds = dbData.map(model => model && model._id);
  const missingIds = filterIds.filter(id => !dbDataIds.includes(id));

  if (missingIds.length === 0) { return; }

  const missingIdsA = getWordsList(missingIds, { op: 'nor', quotes: true });
  const message = `Could not find any model with an 'id' equal to ${missingIdsA}`;
  throwError(message, { reason: 'DB_MODEL_NOT_FOUND' });
};

module.exports = {
  validateMissingIds,
};
