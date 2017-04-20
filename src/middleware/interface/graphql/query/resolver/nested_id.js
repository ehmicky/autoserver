'use strict';


const { intersection } = require('lodash');

const { EngineError } = require('../../../../../error');


/**
 * Make nested models filtered by their parent model
 * E.g. if a model findParent() returns { child: 1 }, then a nested query findChild() will be filtered by `id: 1`
 * If the parent returns nothing|null, the nested query won't be performed and null will be returned
 *  - this means when performing a nested `create`, the parent must specify the id of its non-created-yet children
 **/
const addNestedId = function ({ parent, name, attrName, multiple, args, opType }) {
  // Uses the parent value as a nested filter|data
  const parentVal = parent[attrName];

  // When parent value is not defined, returns empty value
  if (multiple && !(parentVal instanceof Array)) {
    return [];
  } else if (!multiple && parentVal == null) {
    return null;
  }

  // Retrieves arg.filter|data
  const arg = getNestedArgument({ multiple, args, opType });

  // Make sure query is correct
  validateNestedId({ parent, name, attrName, multiple, arg, opType });

  // Add `id` argument
  if (arg instanceof Array) {
    parentVal.forEach((val, index) => {
      arg[index].id = arg[index].id ? intersection(arg[index].id, val) : val;
    });
  } else {
    // If nested `arg.id` is present, do an intersection with parent id. Otherwise, do no intersection.
    arg.id = arg.id ? intersection(arg.id, parentVal) : parentVal;
  }
};

// Returns args.filter for find|delete|update, args.data for replace|upsert|create
const nestedFilterOpTypes = ['find', 'delete', 'update'];
const nestedDataOpTypes = ['replace', 'upsert', 'create'];
const getNestedArgument = function ({ multiple, args, opType }) {
  const usesFilter = nestedFilterOpTypes.includes(opType);
  const usesData = nestedDataOpTypes.includes(opType);
  const argType = usesFilter ? 'filter' : usesData ? 'data' : null;
  // If args.filter|data absent, adds default value
  if (!args[argType]) {
    args[argType] = usesData && multiple ? [] : {};
  }
  return args[argType];
};

// Make sure query is correct, when it comes to nested id
const validateNestedId = function ({ parent, name, attrName, multiple, arg, opType }) {
  const parentVal = parent[attrName];
  if (multiple && arg instanceof Array && arg.length !== parentVal.length) {
    wrongInput(`In '${name}' model, wrong parameters: data length should be ${parentVal.length}`);
  }

  if (arg instanceof Array) {
    arg.forEach(singleArg => {
      validateNestedIdSingle({ name, multiple, arg: singleArg, opType });
    });
  } else {
    validateNestedIdSingle({ name, multiple, arg, opType });
  }
};
const validateNestedIdSingle = function ({ name, multiple, arg, opType }) {
  const allowIntersects = nestedFilterOpTypes.includes(opType) && multiple;
  if (allowIntersects && arg.id && !(arg.id instanceof Array)) {
    wrongInput(`In '${name}' model, wrong parameters: id must be array`);
  }
  if (!allowIntersects && arg.id) {
    wrongInput(`In '${name}' model, wrong parameters: id must not be defined`);
  }
};

const wrongInput = function (message) {
  throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
};


module.exports = {
  addNestedId,
};
