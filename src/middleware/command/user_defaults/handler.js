'use strict';

const { applyAllDefault } = require('./apply');

// Applies schema `default`, if input value is undefined
// This can be a static value or any IDL function
// Not applied on partial write actions like 'update'
const userDefaults = async function (nextFunc, input) {
  const inputA = addUserDefault({ input });

  const response = await nextFunc(inputA);
  return response;
};

const addUserDefault = function ({
  input,
  input: {
    args,
    args: { newData },
    modelName,
    ifv,
    idl,
    idl: { shortcuts: { userDefaultsMap } },
  },
}) {
  if (!newData) { return input; }

  const defAttributes = userDefaultsMap[modelName];
  const newDataA = applyAllDefault({ ifv, defAttributes, value: newData, idl });

  return { ...input, args: { ...args, newData: newDataA } };
};

module.exports = {
  userDefaults,
};
