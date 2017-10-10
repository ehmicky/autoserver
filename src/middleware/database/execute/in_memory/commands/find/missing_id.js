'use strict';

const { toSentence } = require('underscore.string');

const { throwError } = require('../../../../../../error');

// Simulate database 404 errors
const validateMissingIds = function ({ collection, type, attrName, value }) {
  // Only for `id`s
  if (attrName !== 'id') { return; }

  // Only when ids are specifically targetted with 'eq' or 'in'
  const findModelFunc = findModel[type];
  if (findModelFunc === undefined) { return; }

  const hasModel = collection.some(({ id }) => findModelFunc({ value, id }));
  if (hasModel) { return; }

  const message = getMissingIdsMessage({ value });
  throwError(message, { reason: 'DATABASE_NOT_FOUND' });
};

const getMissingIdsMessage = function ({ value }) {
  if (!Array.isArray(value)) {
    return `Could not find any model with 'id' equals to '${value}'`;
  }

  const quotedValues = value.map(val => `'${val}'`);
  const values = toSentence(quotedValues, ', ', ' or ');
  return `Could not find any model with 'id' among ${values}`;
};

const findModel = {
  eq: ({ value, id }) => value === id,
  in: ({ value, id }) => value.includes(id),
};

module.exports = {
  validateMissingIds,
};
