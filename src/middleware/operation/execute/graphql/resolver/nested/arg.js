'use strict';

const { throwError } = require('../../../../../../error');

const { buildNestedArg } = require('./build');

/**
 * Make nested models filtered by their parent model
 * E.g. if a model findParent() returns { child: 1 },
 * then a nested query findChild() will be filtered by `id: 1`
 * If the parent returns nothing|null, the nested query won't be performed
 * and null will be returned
 *  - this means when performing a nested `create`, the parent must specify
 *    the id of its non-created-yet children
 **/
const addNestedArg = function ({
  parentVal,
  name,
  multiple,
  args,
  actionType,
}) {
  const directReturn = getEmptyNestedArg({ parentVal, multiple });
  if (directReturn !== undefined) { return { directReturn }; }

  const nestedArg = getNestedArg({
    parentVal,
    name,
    multiple,
    args,
    actionType,
  });
  return { args: { ...args, ...nestedArg } };
};

// When parent value is not defined, returns empty value
const getEmptyNestedArg = function ({ parentVal, multiple }) {
  if (multiple && !Array.isArray(parentVal)) { return []; }
  if (!multiple && parentVal == null) { return null; }
};

const getNestedArg = function ({
  parentVal,
  name,
  multiple,
  args,
  actionType,
}) {
  const argType = getArgType({ actionType });
  if (!argType) { return {}; }

  const argValue = addDefaultNestedArg({ multiple, args, argType });
  const argValueA = validateNestedArg({ argValue, parentVal, name, multiple });
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
const addDefaultNestedArg = function ({ multiple, args, argType }) {
  if (args[argType]) { return args[argType]; }

  const multipleData = argType === 'data' && multiple;
  return multipleData ? [] : {};
};

// Make sure query is correct, when it comes to nested id
const validateNestedArg = function ({ parentVal, name, multiple, argValue }) {
  const hasDifferentLength = multiple &&
    Array.isArray(argValue) &&
    argValue.length !== parentVal.length;

  if (hasDifferentLength) {
    const message = `In '${name}' model, wrong parameters: data length must be ${parentVal.length}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (!multiple && argValue.id) {
    const message = `In '${name}' model, wrong parameters: 'id' must not be defined`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return argValue;
};

module.exports = {
  addNestedArg,
};
