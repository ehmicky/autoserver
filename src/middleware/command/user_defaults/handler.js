'use strict';

const { applyAllDefault } = require('./apply');

/**
 * Applies schema `default`, if input value is undefined
 * This can be a static value or any JSL
 * Not applied on partial write actions like 'update'
 **/
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
    jsl,
    idl,
    idl: { shortcuts: { userDefaultsMap } },
  },
}) {
  if (!newData) { return input; }

  const defAttributes = userDefaultsMap[modelName];
  const newDataA = applyAllDefault({ jsl, defAttributes, value: newData, idl });

  return { ...input, args: { ...args, newData: newDataA } };
};

module.exports = {
  userDefaults,
};
