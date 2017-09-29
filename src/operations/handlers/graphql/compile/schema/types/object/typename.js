'use strict';

const { mapValues } = require('../../../../../../../utilities');

const addTypeNames = function ({ fields }) {
  return mapValues(fields, (def, defName) => ({ ...def, typeName: defName }));
};

module.exports = {
  addTypeNames,
};
