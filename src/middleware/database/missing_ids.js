'use strict';

const { getWordsList } = require('../../utilities');
const { throwError } = require('../../error');
const { extractSimpleIds, getSimpleFilter } = require('../../database');

// Check if any `id` was not found (404) or was unauthorized (403)
const validateMissingIds = async function (
  { command, response: { data }, args: { filter }, mInput },
  nextLayer,
) {
  if (command !== 'find') { return; }

  const filterIds = extractSimpleIds({ filter });

  // Can be checked only when filtering only by `id`
  // In particular, complex `args.filter` won't be checked
  if (filterIds === undefined) { return; }

  const responseIds = data.map(model => model && model.id);
  const ids = filterIds.filter(id => !responseIds.includes(id));

  if (ids.length === 0) { return; }

  if (hasAuthorizationFilter({ filter })) {
    await checkAuthorization({ ids, nextLayer, mInput });
  }

  throwMissingIds({ ids });
};

// When an authorization filter was used, it adds an 'and' top-level node
const hasAuthorizationFilter = function ({ filter: { type } = {} }) {
  return type === 'and';
};

// Try the same database query, but this time without the authorization filter,
// and only on the missing models.
// If no missing model is missing anymore, flag it as an authorization error.
const checkAuthorization = async function ({
  ids,
  nextLayer,
  mInput: { mInput, args },
}) {
  const filterA = getSimpleFilter({ ids });
  const argsA = { ...args, filter: filterA };
  const mInputA = { ...mInput, args: argsA };

  const { response } = await nextLayer(mInputA);

  const isAuthorizationError = response.length === ids.length;

  if (isAuthorizationError) {
    throwAuthorizationError({ ids });
  }
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
