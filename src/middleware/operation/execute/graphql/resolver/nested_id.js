'use strict';

const { throwError } = require('../../../../../error');
const { isJsl } = require('../../../../../jsl');

/**
 * Make nested models filtered by their parent model
 * E.g. if a model findParent() returns { child: 1 },
 * then a nested query findChild() will be filtered by `id: 1`
 * If the parent returns nothing|null, the nested query won't be performed
 * and null will be returned
 *  - this means when performing a nested `create`, the parent must specify
 *    the id of its non-created-yet children
 **/
const addNestedId = function ({
  parent,
  name,
  attrName,
  multiple,
  args,
  actionType,
}) {
  // Uses the parent value as a nested filter|data
  const parentVal = parent[attrName];

  // When parent value is not defined, returns empty value
  if (multiple && !Array.isArray(parentVal)) {
    return [];
  } else if (!multiple && parentVal == null) {
    return null;
  }

  // Retrieves args.filter|data
  const arg = getNestedArgument({ multiple, args, actionType });

  // Make sure query is correct
  validateNestedId({ parent, name, attrName, multiple, arg });

  // Add `id` argument
  if (Array.isArray(arg)) {
    parentVal.forEach((val, index) => {
      if (arg[index].id) {
        const message = `In '${name}' model, wrong parameters: id must not be defined`;
        wrongInput(message);
      }

      arg[index].id = val;
    });
  } else {
    arg.id = getNestedIds({ childId: arg.id, parentIds: parentVal });
  }
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

// Returns args.filter for find|delete|update,
// args.data for replace|upsert|create
const nestedFilterActionTypes = ['find', 'delete', 'update'];
const nestedDataActionTypes = ['replace', 'upsert', 'create'];

const getNestedArgument = function ({ multiple, args, actionType }) {
  const argType = getArgType({ actionType });

  // If args.filter|data absent, adds default value
  if (!args[argType]) {
    const multipleData = argType === 'data' && multiple;
    args[argType] = multipleData ? [] : {};
  }

  return args[argType];
};

const getArgType = function ({ actionType }) {
  const usesFilter = nestedFilterActionTypes.includes(actionType);
  const usesData = nestedDataActionTypes.includes(actionType);

  if (usesFilter) {
    return 'filter';
  }

  if (usesData) {
    return 'data';
  }

  return null;
};

// Make sure query is correct, when it comes to nested id
const validateNestedId = function ({ parent, name, attrName, multiple, arg }) {
  const parentVal = parent[attrName];

  if (multiple && Array.isArray(arg) && arg.length !== parentVal.length) {
    const message = `In '${name}' model, wrong parameters: data length must be ${parentVal.length}`;
    wrongInput(message);
  }

  if (!multiple && arg.id) {
    const message = `In '${name}' model, wrong parameters: 'id' must not be defined`;
    wrongInput(message);
  }
};

const wrongInput = function (message) {
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  addNestedId,
};
