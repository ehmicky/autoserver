'use strict';


const { intersection } = require('lodash');

const { getParentModel } = require('./utilities');
const { EngineError } = require('../../../../../error');


// Resolver for nested model operations
const nestedModelResolver = function ({ name, modelsMap, parent, args }) {
  // Looks up at parent value to know what is the current model
  const { modelName: parentModel, opType } = getParentModel(parent);
  const model = modelsMap[parentModel] && modelsMap[parentModel][name];
  // If it is a normal attribute which just returns its parent value
  if (!model) {
    return { directReturn: parent[name] === undefined ? null : parent[name] };
  }
  const { multiple, model: modelName } = model;

  const directReturn = addNestedId({ parent, name, multiple, args, opType });

  return { multiple, modelName, opType, directReturn };
};

/**
 * Make nested models filtered by their parent model
 * E.g. if a model findParent() returns { child: 1 }, then a nested query findChild() will be filtered by `id: 1`
 * If the parent returns nothing|null, the nested query won't be performed and null will be returned
 *  - this means when performing a nested `create`, the parent must specify the id of its non-created-yet children
 **/
const nestedFilterOpTypes = ['find', 'delete', 'update'];
const nestedDataOpTypes = ['replace', 'upsert', 'create'];
const addNestedId = function ({ parent, name, multiple, args, opType }) {
  const parentVal = parent[name];
  const usesFilter = nestedFilterOpTypes.includes(opType);
  const usesData = nestedDataOpTypes.includes(opType);
  const argType = usesFilter ? 'filter' : usesData ? 'data' : null;
  if (!args[argType]) {
    args[argType] = usesData && multiple ? [] : {};
  }
  const arg = args[argType];

  if (multiple) {
    // Make sure parent value is defined and correct
    if (!(parentVal instanceof Array)) { return []; }
    if (arg instanceof Array) {
      if (arg.length !== parentVal.length) {
        throw new EngineError(`In '${name}' model, wrong parameters: data length should be ${parentVal.length}`, {
          reason: 'clientInputSyntax',
        });
      }
      parentVal.forEach((singleVal, index) => {
        addNestedIdToArg({ arg: arg[index], parentVal: singleVal, name, allowIntersects: usesFilter });
      });
    } else {
      addNestedIdToArg({ arg, parentVal, name, allowIntersects: usesFilter });
    }
  } else {
    // Make sure parent value is defined and correct
    if (parentVal == null) { return null; }
    addNestedIdToArg({ arg, parentVal, name });
  }
};

const addNestedIdToArg = function ({ arg, parentVal, name, allowIntersects = false }) {
  if (arg.id) {
    if (!allowIntersects) {
      throw new EngineError(`In '${name}' model, wrong parameters: id must not be defined`, {
        reason: 'clientInputSyntax',
      });
    // If `id` argument is specified by client, intersects with it
    } else {
      if (!(arg.id instanceof Array)) {
        throw new EngineError(`In '${name}' model, wrong parameters: id must be array`, {
          reason: 'clientInputSyntax',
        });
      }
      arg.id = intersection(arg.id, parentVal);
    }
  } else {
    // Add `id` argument
    arg.id = parentVal;
  }
};


module.exports = {
  nestedModelResolver,
};
