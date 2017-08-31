'use strict';

const { omitBy } = require('../../../../../../utilities');

const filterFields = function ({
  fields,
  parentDef: { kind, action },
  opts: { inputObjectType },
}) {
  return omitBy(fields, (def, defName) =>
    filterField({ kind, action, def, defName, inputObjectType })
  );
};

const filterField = function (opts) {
  return filters.some(filter => filter(opts));
};

// Filter arguments for single actions only include `id`
const singleIdFilter = function ({ defName, inputObjectType, action }) {
  return defName !== 'id' &&
    inputObjectType === 'filter' &&
    !action.multiple;
};

// Nested data arguments do not include `id`
const nestedIdData = function ({ defName, inputObjectType, kind }) {
  return defName === 'id' &&
    inputObjectType === 'data' &&
    kind === 'attribute';
};

// Computed fields cannot be specified as data argument
const computeData = function ({ def, inputObjectType }) {
  return inputObjectType === 'data' &&
    def.compute !== undefined;
};

// Readonly fields cannot be specified as data argument,
// except during model creation
const readonlyData = function ({ def, inputObjectType, action }) {
  return inputObjectType === 'data' &&
    def.readonly &&
    !['create', 'upsert'].includes(action.type);
};

// `updateOne|updateMany` do not allow data.id
const updateIdData = function ({ defName, inputObjectType, action }) {
  return defName === 'id' &&
    inputObjectType === 'data' &&
    action.type === 'update';
};

const filters = [
  singleIdFilter,
  nestedIdData,
  computeData,
  readonlyData,
  updateIdData,
];

module.exports = {
  filterFields,
};
