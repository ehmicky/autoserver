'use strict';

const { omitBy } = require('../../../../../../../utilities');

const filterFields = function ({
  fields,
  parentDef: { kind, command },
  opts: { inputObjectType },
}) {
  return omitBy(fields, (def, defName) =>
    filterField({ kind, command, def, defName, inputObjectType })
  );
};

const filterField = function (opts) {
  return filters.some(filter => filter(opts));
};

// Filter arguments for single commands only include `id`
const singleIdFilter = function ({ defName, inputObjectType, command }) {
  return defName !== 'id' &&
    inputObjectType === 'filter' &&
    !command.multiple;
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
const readonlyData = function ({ def, inputObjectType, command }) {
  return inputObjectType === 'data' &&
    def.readonly &&
    command.type !== 'create';
};

// `patchOne|patchMany` do not allow data.id
const patchIdData = function ({ defName, inputObjectType, command }) {
  return defName === 'id' &&
    inputObjectType === 'data' &&
    command.type === 'patch';
};

const filters = [
  singleIdFilter,
  nestedIdData,
  computeData,
  readonlyData,
  patchIdData,
];

module.exports = {
  filterFields,
};
