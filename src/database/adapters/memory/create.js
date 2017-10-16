'use strict';

const { throwError } = require('../../../error');

const { wrapCommand } = require('./wrap');

const create = function ({ collection, newData }) {
  newData.forEach(({ id }) => validateCreateId({ collection, id }));

  // eslint-disable-next-line fp/no-mutating-methods
  collection.push(...newData);
};

const validateCreateId = function ({ collection, id }) {
  const hasModel = collection.some(model => model.id === id);
  if (!hasModel) { return; }

  const message = `Model with id '${id}' already exists`;
  throwError(message, { reason: 'DB_MODEL_CONFLICT' });
};

const wCreate = wrapCommand.bind(null, create);

module.exports = {
  create: wCreate,
};
