'use strict';

const { throwError } = require('../../../../../../error');

// Make nested models filtered by their parent model
// E.g. if a model findParent() returns { child: 1 },
// then a nested query findChild() will be filtered by `id: 1`
// If the parent returns nothing|null, the nested query won't be performed
// and null will be returned
//  - this means when performing a nested `create`, the parent must specify
//    the id of its non-created-yet children
const addNestedArg = function ({ parentVal, name, isArray, args, actionType }) {
  const directReturn = getEmptyNestedArg({ parentVal, isArray });
  if (directReturn !== undefined) { return { directReturn }; }

  const nestedArg = getNestedArg({
    parentVal,
    name,
    isArray,
    args,
    actionType,
  });
  return { args: { ...args, ...nestedArg } };
};

// When parent value is not defined, returns empty value
const getEmptyNestedArg = function ({ parentVal, isArray }) {
  if (isArray && !Array.isArray(parentVal)) { return []; }
  if (!isArray && parentVal == null) { return null; }
};

const getNestedArg = function ({ parentVal, name, isArray, args, actionType }) {
  const argType = getArgType({ actionType });
  if (!argType) { return {}; }

  const argValue = addDefaultNestedArg({ isArray, args, argType });
  const argValueA = validateNestedArg({ argValue, parentVal, name, isArray });
  const argValueB = buildNestedArg({ argValue: argValueA, parentVal, name });

  return { [argType]: argValueB };
};

// Returns args.filter for find|delete|update,
// args.data for replace|upsert|create
const getArgType = function ({ actionType }) {
  const usesFilter = nestedFilterActionTypes.includes(actionType);
  if (usesFilter) { return 'filter'; }

  const usesData = nestedDataActionTypes.includes(actionType);
  if (usesData) { return 'data'; }

  return false;
};

const nestedFilterActionTypes = ['find', 'delete', 'update'];
const nestedDataActionTypes = ['replace', 'upsert', 'create'];

// If args.filter|data absent, adds default value
const addDefaultNestedArg = function ({ isArray, args, argType }) {
  if (args[argType]) { return args[argType]; }

  const multipleData = argType === 'data' && isArray;
  return multipleData ? [] : {};
};

// Make sure query is correct, when it comes to nested id
const validateNestedArg = function ({ parentVal, name, isArray, argValue }) {
  const hasDifferentLength = isArray &&
    Array.isArray(argValue) &&
    argValue.length !== parentVal.length;

  if (hasDifferentLength) {
    const message = `In '${name}' model, wrong parameters: data length must be ${parentVal.length}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (!isArray && argValue.id) {
    const message = `In '${name}' model, wrong parameters: 'id' must not be defined`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return argValue;
};

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
      const message = `In '${name}' model, wrong parameters: 'id' must not be defined`;
      throwError(message, { reason: 'INPUT_VALIDATION' });
    }

    const id = parentVal[index];
    return { ...singleArgValue, id };
  });
};

// If nested `args.id` is present, do an intersection with parent id.
const buildNestedArgObject = function ({ argValue, parentVal }) {
  const id = getIntersectedIds({ argValue, parentVal });
  return { ...argValue, id };
};

const getIntersectedIds = function ({ argValue, parentVal }) {
  if (!argValue.id) { return parentVal; }

  const ids = Array.isArray(argValue.id) ? argValue.id : [argValue.id];
  return parentVal.filter(parentId => ids.includes(parentId));
};

module.exports = {
  addNestedArg,
};
