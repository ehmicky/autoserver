'use strict';

const { throwError } = require('../../../../../../error');
const { isJsl } = require('../../../../../../jsl');

// Add `id` argument
const buildNestedArg = function ({ argValue, parentVal, name }) {
  const nestedFunc = Array.isArray(argValue)
    ? buildNestedArgArray
    : buildNestedArgObject;
  return nestedFunc({ argValue, parentVal, name });
};

const buildNestedArgArray = function ({ argValue, parentVal, name }) {
  return argValue.map((singleArgValue, index) => {
    if (singleArgValue.id) {
      const message = `In '${name}' model, wrong parameters: id must not be defined`;
      throwError(message, { reason: 'INPUT_VALIDATION' });
    }

    const id = parentVal[index];
    return { ...singleArgValue, id };
  });
};

const buildNestedArgObject = function ({ argValue, parentVal }) {
  const id = getNestedIds({ childId: argValue.id, parentIds: parentVal });

  return { ...argValue, id };
};

// If nested `args.id` is present, do an intersection with parent id.
// Otherwise, do not do intersection.
// In all cases, uses JSL
const getNestedIds = function ({ childId, parentIds }) {
  const ids = getIds({ parentIds });
  return getIntersectedIds({ ids, childId });
};

// Uses JSL syntax
const getIds = function ({ parentIds }) {
  if (Array.isArray(parentIds)) {
    return `(${JSON.stringify(parentIds)}.includes($))`;
  }

  // If parentIds is scalar, this means child action is single.
  // Single action filters cannot use JSL, and childId will be undefined
  return parentIds;
};

// Intersections
const getIntersectedIds = function ({ ids, childId }) {
  if (!childId) { return ids; }

  // Converts to JSL if not JSL already
  if (!isJsl({ jsl: childId })) {
    return `(${ids} && ($ === ${JSON.stringify(childId)}))`;
  }

  return `(${ids} && ${childId})`;
};

module.exports = {
  buildNestedArg,
};
