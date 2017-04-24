'use strict';


const { getTypeName, getParentModel } = require('./utilities');


const typenameResolver = function ({ parent }) {
  const { actionType, modelName } = getParentModel(parent);
  const typename = getTypeName(`${actionType} ${modelName}`);
  return typename;
};


module.exports = {
  typenameResolver,
};
