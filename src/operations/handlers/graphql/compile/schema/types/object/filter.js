'use strict';

const filterField = function (def, opts) {
  const isFiltered = filters.some(filter => filter(def, opts));
  return isFiltered ? null : def;
};

// Filter arguments for single commands only include `id`
const singleIdFilter = function (def, {
  inputObjectType,
  parentDef: { command },
  defName,
}) {
  return defName !== 'id' &&
    inputObjectType === 'filter' &&
    !command.multiple;
};

// Computed fields cannot be specified as data argument
const computeData = function ({ compute }, { inputObjectType }) {
  return inputObjectType === 'data' &&
    compute !== undefined;
};

// Readonly fields cannot be specified as data argument,
// except during model creation
const readonlyData = function ({ readonly }, {
  inputObjectType,
  parentDef: { command },
}) {
  return inputObjectType === 'data' &&
    readonly &&
    command.type !== 'create';
};

// `patchOne|patchMany` do not allow data.id
const patchIdData = function (def, {
  inputObjectType,
  parentDef: { command },
  defName,
}) {
  return defName === 'id' &&
    inputObjectType === 'data' &&
    command.type === 'patch';
};

const filters = [
  singleIdFilter,
  computeData,
  readonlyData,
  patchIdData,
];

module.exports = {
  filterField,
};
