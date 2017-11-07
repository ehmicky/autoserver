'use strict';

const filterField = function (def, opts) {
  const isFiltered = filters.some(filter => filter(def, opts));
  return isFiltered ? null : def;
};

// `patchOne|patchMany` do not allow data.id
const patchIdData = function ({ command }, { inputObjectType, defName }) {
  return inputObjectType === 'data' &&
    command.type === 'patch' &&
    defName === 'id';
};

const filters = [
  patchIdData,
];

module.exports = {
  filterField,
};
