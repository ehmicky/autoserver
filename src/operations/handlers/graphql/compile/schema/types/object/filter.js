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

// `patchOne|patchMany` do not allow data.id
const patchIdData = function ({ command }, { inputObjectType, defName }) {
  return inputObjectType === 'data' &&
    command.type === 'patch' &&
    defName === 'id';
};

const filters = [
  singleIdFilter,
  patchIdData,
];

module.exports = {
  filterField,
};
