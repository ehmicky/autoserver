'use strict';

const { applyAllDefault } = require('./apply');

// Applies schema `default`, if input value is undefined
// This can be a static value or any IDL function
// Not applied on partial write actions like 'update'
const userDefaults = function (input) {
  const {
    args,
    args: { newData },
    modelName,
    idl,
    idl: { shortcuts: { userDefaultsMap } },
  } = input;

  if (!newData) { return; }

  const defAttributes = userDefaultsMap[modelName];
  const newDataA = applyAllDefault({
    defAttributes,
    value: newData,
    idl,
    input,
  });

  return { args: { ...args, newData: newDataA } };
};

module.exports = {
  userDefaults,
};
