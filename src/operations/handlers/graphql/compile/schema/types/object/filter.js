'use strict';

const filterField = function (def, opts) {
  const isFiltered = filters.some(filter => filter(def, opts));
  return isFiltered ? null : def;
};

// Filter arguments for single commands only include `id`
const singleIdFilter = function ({ command }, { inputObjectType, defName }) {
  return inputObjectType === 'filter' &&
    !command.multiple &&
    defName !== 'id';
};

// Readonly fields cannot be specified as data argument,
// except during model creation
const readonlyData = function ({ command, readonly }, { inputObjectType }) {
  return inputObjectType === 'data' &&
    command.type !== 'create' &&
    readonly;
};

// `patchOne|patchMany` do not allow data.id
const patchIdData = function ({ command }, { inputObjectType, defName }) {
  return inputObjectType === 'data' &&
    command.type === 'patch' &&
    defName === 'id';
};

const filters = [
  singleIdFilter,
  readonlyData,
  patchIdData,
];

module.exports = {
  filterField,
};
