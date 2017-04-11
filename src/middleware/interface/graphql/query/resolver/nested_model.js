'use strict';


const { intersection } = require('lodash');

const { getParentModel } = require('./utilities');


// Resolver for nested model operations
const nestedModelResolver = function ({ attrName, modelsMap, parent, args }) {
  // Looks up at parent value to know what is the current model
  const parentModel = getParentModel(parent);
  const model = modelsMap[parentModel] && modelsMap[parentModel][attrName];
  if (!model) { return {}; }

  const { multiple, model: modelName } = model;
  const { directReturn, id, ids } = getNestedId({ parent, attrName, multiple, args });
  const extraArgs = Object.assign({}, id ? { id } : {}, ids ? { ids } : {});

  return { multiple, modelName, extraArgs, directReturn };
};

/**
 * Make nested models filtered by their parent model
 * E.g. if a model findParent() returns { child: 1 }, then a nested query findChild() will be filtered by `id: 1`
 * If the parent returns nothing|null, the nested query won't be performed and null will be returned
 *  - this means when performing a nested `create`, the parent must specify the id of its non-created-yet children
 * Will add `id` argument for *One operations, `ids` for *Many operations
 **/
const getNestedId = function ({ parent, attrName, multiple, args }) {
  const parentVal = parent[attrName];
  if (multiple) {
    // Make sure parent value is defined and correct
    if (!(parentVal instanceof Array)) { return { directReturn: [] }; }
    // If `ids` filter is specified by client, intersects with it
    if (args.ids && args.ids instanceof Array) {
      return { ids: intersection(args.ids, parentVal) };
    } else {
      // Add `ids` filter
      return { ids: parentVal };
    }
  } else {
    // Make sure parent value is defined and correct
    if (parentVal == null) { return { directReturn: null }; }
    // Add `id` filter
    return { id: parentVal };
  }
};


module.exports = {
  nestedModelResolver,
};
