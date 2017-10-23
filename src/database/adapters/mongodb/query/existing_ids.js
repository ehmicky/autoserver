'use strict';

const { getWordsList } = require('../../../../utilities');
const { rethrowError, throwError } = require('../../../../error');

// Throw DB_MODEL_CONFLICT errors, i.e. when creating a model that already
// exists.
// With MongoDB, the database will throw an error with a specific code,
// so we catch it here and convert it to a standard error.
const checkExistingIds = function (error, { newData }) {
  if (error.code !== MODEL_CONFLICT_CODE) {
    rethrowError(error);
  }

  const id = getId({ error, newData });
  const message = `Model with id ${id} already exists`;
  throwError(message, { reason: 'DB_MODEL_CONFLICT' });
};

// Try to guess which model conflicts by looking at error message
// Otherwise returns all model ids that might have conflicted
const getId = function ({ error: { message }, newData }) {
  const model = newData.find(({ _id }) => message.includes(`"${_id}"`));

  if (model !== undefined) {
    // eslint-disable-next-line no-underscore-dangle
    return `'${model._id}'`;
  }

  const ids = newData.map(({ _id }) => _id);
  const idsA = getWordsList(ids, { quotes: true });
  return idsA;
};

// MongoDB-specific error code
const MODEL_CONFLICT_CODE = 11000;

module.exports = {
  checkExistingIds,
};
