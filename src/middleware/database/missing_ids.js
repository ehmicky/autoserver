'use strict';

const { getWordsList } = require('../../utilities');
const { throwError } = require('../../error');
const { extractSimpleIds, getSimpleFilter } = require('../../database');

// Check if any `id` was not found (404) or was unauthorized (403)
const validateMissingIds = async function (
  { command, response, args: { filter }, mInput },
  nextLayer,
) {
  // Other commands trigger this middleware during their `currentData` actions
  if (command !== 'find') { return; }

  const ids = getMissingIds({ filter, response });
  if (ids.length === 0) { return; }

  // Check whether this is because the model does not exist, or because it is
  // not authorized
  await checkAuthorization({ filter, ids, nextLayer, mInput });

  throwMissingIds({ ids });
};

// Retrieve missing models ids
const getMissingIds = function ({ filter, response: { data } }) {
  const filterIds = extractSimpleIds({ filter });

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
  filter,
  ids,
  nextLayer,
  mInput: { mInput, args },
}) {
  if (!hasAuthorizationFilter({ filter })) { return; }

  const filterA = getSimpleFilter({ ids });
  const mInputA = { ...mInput, args: { ...args, filter: filterA } };

  const { response } = await nextLayer(mInputA);

  const isAuthorizationError = response.length === ids.length;
  if (!isAuthorizationError) { return; }

  throwAuthorizationError({ ids });
};

// When an authorization filter was used, it adds an 'and' top-level node
// with some node children with the `isAuthorization` `true` flag
const hasAuthorizationFilter = function ({ filter: { type, value } = {} }) {
  return type === 'and' && value.some(({ isAuthorization }) => isAuthorization);
};

const throwMissingIds = function ({ ids }) {
  const idsA = getWordsList(ids, { op: 'nor', quotes: true });
  const message = `Could not find any model with an 'id' equal to ${idsA}`;
  throwError(message, { reason: 'DB_MODEL_NOT_FOUND' });
};

const throwAuthorizationError = function ({ ids }) {
  const idsA = getWordsList(ids, { op: 'and', quotes: true });
  const message = `The models with the following 'id's are not allowed: ${idsA}`;
  throwError(message, { reason: 'AUTHORIZATION' });
};

module.exports = {
  validateMissingIds,
};
