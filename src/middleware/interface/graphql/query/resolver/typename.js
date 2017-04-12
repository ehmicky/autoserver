'use strict';


const { getTypeName, getParentModel } = require('./utilities');


const typenameResolver = function ({ parent }) {
  const { opType, modelName } = getParentModel(parent);
  const typename = getTypeName(`${opType} ${modelName}`);
  return typename;
};


module.exports = {
  typenameResolver,
};
