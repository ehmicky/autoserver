'use strict';

const { difference } = require('../../utilities');
const { throwCommonError } = require('../../error');
const { extractSimpleIds, getSimpleFilter } = require('../../filter');

// Check if any `id` was not found (404) or was unauthorized (403)
const validateMissingIds = function (
  {
    command,
    modelName,
    response,
    args: { filter, preFilter },
    top,
    top: { command: { type: topCommand } },
    mInput,
  },
  nextLayer,
) {
  // Other commands trigger this middleware during their `currentData` actions
  // Also, `create`'s currentData query is skipped.
  if (command !== 'find' || topCommand === 'create') { return; }

  const ids = getMissingIds({ filter, preFilter, response });
  if (ids.length === 0) { return; }

  return reportProblem({ preFilter, ids, modelName, top, nextLayer, mInput });
};

// Retrieve missing models ids
const getMissingIds = function ({ filter, preFilter, response: { data } }) {
  const filterA = preFilter === undefined ? filter : preFilter;
  const filterIds = extractSimpleIds({ filter: filterA });

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

// Check whether this is because the model does not exist,
// or because it is not authorized
const reportProblem = async function ({
  preFilter,
  ids,
  modelName,
  top,
  top: { command: { type: topCommand } },
  nextLayer,
  mInput,
}) {
  const idsA = await checkAuthorization({
    preFilter,
    ids,
    modelName,
    top,
    nextLayer,
    mInput,
  });

  // `upsert` commands might throw authorization errors, but not model not found
  if (topCommand === 'upsert') { return; }

  throwCommonError({ reason: 'DB_MODEL_NOT_FOUND', ids: idsA, modelName });
};

// Try the same database query, but this time without the authorization filter,
// and only on the missing models.
// If no missing model is missing anymore, flag it as an authorization error.
const checkAuthorization = async function ({
  preFilter,
  ids,
  modelName,
  top,
  nextLayer,
  mInput,
  mInput: { args },
}) {
  if (preFilter === undefined) { return ids; }

  const filterA = getSimpleFilter({ ids });
  const mInputA = { ...mInput, args: { ...args, filter: filterA } };

  const { dbData } = await nextLayer(mInputA, 'adapter');

  const responseIds = dbData.map(({ id }) => id);
  const missingIds = difference(ids, responseIds);

  if (missingIds.length > 0) { return missingIds; }

  throwCommonError({ reason: 'AUTHORIZATION', ids, modelName, top });
};

module.exports = {
  validateMissingIds,
};
