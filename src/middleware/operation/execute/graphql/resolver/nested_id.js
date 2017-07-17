'use strict';

const { EngineError } = require('../../../../../error');
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
  if (multiple && !(parentVal instanceof Array)) {
    return [];
  } else if (!multiple && parentVal == null) {
    return null;
  }

  // Retrieves args.filter|data
  const arg = getNestedArgument({ multiple, args, actionType });

  // Make sure query is correct
  validateNestedId({ parent, name, attrName, multiple, arg });

  // Add `id` argument
  if (arg instanceof Array) {
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
  // Uses JSL syntax
  let ids;

  if (parentIds instanceof Array) {
    ids = `(${JSON.stringify(parentIds)}.includes($))`;
  } else {
    // If parentIds is scalar, this means child action is single.
    // Single action filters cannot use JSL, and childId will be undefined
    ids = parentIds;
  }

  // Intersections
  if (childId) {
    // Converts to JSL if not JSL already
    if (isJsl({ jsl: childId })) {
      ids = `(${ids} && ${childId})`;
    } else {
      ids = `(${ids} && ($ === ${JSON.stringify(childId)}))`;
    }
  }

  return ids;
};

// Returns args.filter for find|delete|update,
// args.data for replace|upsert|create
const nestedFilterActionTypes = ['find', 'delete', 'update'];
const nestedDataActionTypes = ['replace', 'upsert', 'create'];

const getNestedArgument = function ({ multiple, args, actionType }) {
  const usesFilter = nestedFilterActionTypes.includes(actionType);
  const usesData = nestedDataActionTypes.includes(actionType);
  const argType = usesFilter ? 'filter' : usesData ? 'data' : null;

  // If args.filter|data absent, adds default value
  if (!args[argType]) {
    args[argType] = usesData && multiple ? [] : {};
  }

  return args[argType];
};

// Make sure query is correct, when it comes to nested id
const validateNestedId = function ({ parent, name, attrName, multiple, arg }) {
  const parentVal = parent[attrName];

  if (multiple && arg instanceof Array && arg.length !== parentVal.length) {
    const message = `In '${name}' model, wrong parameters: data length must be ${parentVal.length}`;
    wrongInput(message);
  }

  if (!multiple && arg.id) {
    const message = `In '${name}' model, wrong parameters: 'id' must not be defined`;
    wrongInput(message);
  }
};

const wrongInput = function (message) {
  throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  addNestedId,
};
