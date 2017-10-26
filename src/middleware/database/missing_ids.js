'use strict';

const { difference, isEqual } = require('lodash');

const { getWordsList } = require('../../utilities');
const { throwError, throwCommonError } = require('../../error');
const { extractSimpleIds, getSimpleFilter } = require('../../database');

// Check if any `id` was not found (404) or was unauthorized (403)
const validateMissingIds = async function (
  {
    command,
    modelName,
    response,
    args: { preAuthorizeFilter, filter },
    top,
    mInput,
  },
  nextLayer,
) {
  // Other commands trigger this middleware during their `currentData` actions
  if (command !== 'find') { return; }

  const ids = getMissingIds({ preAuthorizeFilter, response });
  if (ids.length === 0) { return; }

  // Check whether this is because the model does not exist, or because it is
  // not authorized
  const missingIds = await checkAuthorization({
    preAuthorizeFilter,
    filter,
    ids,
    modelName,
    top,
    nextLayer,
    mInput,
  });

  throwMissingIds({ ids: missingIds, modelName });
};

// Retrieve missing models ids
const getMissingIds = function ({ preAuthorizeFilter, response: { data } }) {
  const filterIds = extractSimpleIds({ filter: preAuthorizeFilter });

  // This middleware can be checked only when filtering only by `id`.
  // Checking complex `args.filter` is tricky. It is hard to know whether a
  // model is missing because it does not exist, because it was filter by
  // authorization filter, or because it was filter by user-specified
  // `args.filter`.
  // This means that in general, findMany|deleteMany|updateMany top-level
  // actions won't use this middleware, unless they are using very simple
  // `args.filter` like `{ id: { in: ['4', '5'] } }`
  if (filterIds === undefined) { return []; }

  const responseIds = data.map(({ id }) => id);
  const ids = filterIds.filter(id => !responseIds.includes(id));

  return ids;
};

// Try the same database query, but this time without the authorization filter,
// and only on the missing models.
// If no missing model is missing anymore, flag it as an authorization error.
const checkAuthorization = async function ({
  preAuthorizeFilter,
  filter,
  ids,
  modelName,
  top,
  nextLayer,
  mInput,
  mInput: { args },
}) {
  if (isEqual(preAuthorizeFilter, filter)) { return ids; }

  const filterA = getSimpleFilter({ ids });
  const mInputA = { ...mInput, args: { ...args, filter: filterA } };

  const { response: { data } } = await nextLayer(mInputA);

  const responseIds = data.map(({ id }) => id);
  const missingIds = difference(ids, responseIds);

  if (missingIds.length > 0) { return missingIds; }

  throwCommonError({ reason: 'AUTHORIZATION', ids, modelName, top });
};

const throwMissingIds = function ({ ids, modelName }) {
  const idsA = getWordsList(ids, { op: 'nor', quotes: true });
  const message = `Could not find any '${modelName}' with an 'id' equal to ${idsA}`;
  throwError(message, { reason: 'DB_MODEL_NOT_FOUND' });
};

module.exports = {
  validateMissingIds,
};
