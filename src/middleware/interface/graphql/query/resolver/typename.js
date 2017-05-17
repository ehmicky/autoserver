'use strict';


const { getTypeName, getParentModel } = require('./utilities');


const typenameResolver = function ({ parent }) {
  const { action, modelName } = getParentModel(parent);
  const typename = getTypeName(`${action.type} ${modelName}`);
  return typename;
};


module.exports = {
  typenameResolver,
};
