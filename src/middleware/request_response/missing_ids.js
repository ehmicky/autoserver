'use strict';

const { difference } = require('../../utilities');
const { throwCommonError } = require('../../errors');
const { extractSimpleIds, getSimpleFilter } = require('../../filter');

// Check if any `id` was not found (404) or was unauthorized (403)
const validateMissingIds = function (
  {
    command,
    clientCollname,
    response,
    args: { filter, preFilter },
    commandpath,
    top,
    mInput,
  },
  nextLayer,
) {
  const noValidate = doesNotValidate({ command, top, commandpath });
  if (noValidate) { return; }

  const ids = getMissingIds({ filter, preFilter, response });
  if (ids.length === 0) { return; }

  return reportProblem({
    top,
    clientCollname,
    preFilter,
    ids,
    nextLayer,
    mInput,
  });
};

const doesNotValidate = function ({ command, top, commandpath }) {
  // Other commands trigger this middleware during their `currentData` actions
  return command !== 'find' ||
    // `create`'s currentData query is skipped.
    top.command.type === 'create' ||
    // Top-level `findMany|patchMany|deleteMany` are not checked because:
    //  - it would only be applied if filter is simple, i.e. behavior is less
    //    predictable for the client
    //  - it makes less sense from semantic point of view
    //  - pagination prevents guessing missing ids
    (FILTER_MANY_COMMANDS.includes(top.command.name) && commandpath === '');
};

// Commands with a `filter` argument
const FILTER_MANY_COMMANDS = ['findMany', 'patchMany', 'deleteMany'];

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
  // `args.filter` like `{ id: { _in: ['4', '5'] } }`
  if (filterIds === undefined) { return []; }

  const responseIds = data.map(({ id }) => id);
  const ids = filterIds.filter(id => !responseIds.includes(id));

  return ids;
};

// Check whether this is because the model does not exist,
// or because it is not authorized
const reportProblem = async function ({ top, clientCollname, ...rest }) {
  const idsA = await checkAuthorization({ top, clientCollname, ...rest });

  // `upsert` commands might throw authorization errors, but not model not found
  if (top.command.type === 'upsert') { return; }

  throwCommonError({ reason: 'NOT_FOUND', ids: idsA, clientCollname });
};

// Try the same database query, but this time without the authorization filter,
// and only on the missing models.
// If no missing model is missing anymore, flag it as an authorization error.
const checkAuthorization = async function ({
  top,
  clientCollname,
  preFilter,
  ids,
  nextLayer,
  mInput,
  mInput: { args },
}) {
  if (preFilter === undefined) { return ids; }

  const filterA = getSimpleFilter({ ids });
  const mInputA = { ...mInput, args: { ...args, filter: filterA } };

  const { dbData } = await nextLayer(mInputA, 'database');

  const responseIds = dbData.map(({ id }) => id);
  const missingIds = difference(ids, responseIds);

  if (missingIds.length !== 0) { return missingIds; }

  throwCommonError({ reason: 'AUTHORIZATION', ids, clientCollname, top });
};

module.exports = {
  validateMissingIds,
};
