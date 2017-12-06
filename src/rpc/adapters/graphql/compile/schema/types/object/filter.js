'use strict';

const filterField = function (def, opts) {
  const isFiltered = filters.some(filter => filter(def, opts));
  return isFiltered ? null : def;
};

// `patch` does not allow `data.id`
const patchIdData = function ({ command }, { inputObjectType, defName }) {
  return inputObjectType === 'data' && command === 'patch' && defName === 'id';
};

const filters = [
  patchIdData,
];

module.exports = {
  filterField,
};
