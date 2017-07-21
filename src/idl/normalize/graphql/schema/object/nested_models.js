'use strict';

const { omit } = require('../../../../../utilities');
const { getActionName } = require('../name');
const { getSubDef, isModel, isMultiple } = require('../utilities');

const getNestedModels = function ({
  childDef,
  childDefName,
  inputObjectType,
  action,
  def,
}) {
  const subDef = getSubDef(childDef);

  // Only for nested models
  if (!(isModel(subDef) && !subDef.isTopLevel)) {
    return { [childDefName]: childDef };
  }

  const nestedModel = getNestedModel({
    childDef,
    childDefName,
    inputObjectType,
    action,
    def,
  });

  const nestedId = getNestedId({ childDef, childDefName, subDef });

  return Object.assign({}, nestedModel, nestedId);
};

// Copy nested models with a different name that includes the action,
// e.g. `my_attribute` -> `createMyAttribute`
const getNestedModel = function ({
  childDef,
  childDefName,
  inputObjectType,
  action,
  def,
}) {
  // Not for data|filter arguments
  if (inputObjectType !== '') { return {}; }

  const name = getActionName({
    modelName: childDefName,
    action,
    noChange: true,
  });

  // Add transformed name to `required` array,
  // if non-transformed name was present
  const required = Array.isArray(def.required) &&
    def.required.includes(childDefName) &&
    !def.required.includes(name);

  if (required) {
    def.required.push(name);
  }

  return { [name]: childDef };
};

const getNestedId = function ({
  childDef,
  childDefName,
  subDef,
}) {
  // Nested models use the regular name as well, but as simple ids,
  // not recursive definition
  // Retrieves `id` field definition of subfield
  const nonRecursiveAttrs = [
    'description',
    'deprecation_reason',
    'examples',
    // Consider this attribute as a normal attribute, not a model anymore
    'model',
  ];
  const recursiveAttrs = ['model', 'type'];
  const idDef = Object.assign(
    {},
    omit(subDef.properties.id, nonRecursiveAttrs),
    omit(subDef, recursiveAttrs)
  );

  // Assign `id` field definition to e.g. `model.user`
  const idsDef = isMultiple(childDef)
    ? Object.assign({}, childDef, { items: idDef })
    : idDef;

  return { [childDefName]: idsDef };
};

module.exports = {
  getNestedModels,
};
