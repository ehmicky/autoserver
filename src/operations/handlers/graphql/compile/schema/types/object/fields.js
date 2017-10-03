'use strict';

const { getNestedModels } = require('./nested_models');
const { filterFields } = require('./filter');
const { getFinalFields } = require('./final_fields');
const { addNoAttributes } = require('./no_attributes');

// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (parentDef, opts) {
  // This needs to be function, otherwise we run in an infinite recursion,
  // if the children try to reference a parent type
  return () => mappers.reduce(
    (fields, mapper) => mapper({ fields, parentDef, opts }),
    parentDef.attributes,
  );
};

const mappers = [
  getNestedModels,
  filterFields,
  getFinalFields,
  addNoAttributes,
];

module.exports = {
  getObjectFields,
};
