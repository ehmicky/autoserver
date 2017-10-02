'use strict';

const { applyAllDefault } = require('./apply');

// Applies schema `default`, if value is undefined
// This can be a static value or any IDL function
// Not applied on partial write commands like 'patch'
const userDefaults = function ({
  args,
  args: { newData },
  modelName,
  idl: { shortcuts: { userDefaultsMap } },
  mInput,
}) {
  if (!newData) { return; }

  const defAttributes = userDefaultsMap[modelName];
  const newDataA = applyAllDefault({ data: newData, defAttributes, mInput });

  return { args: { ...args, newData: newDataA } };
};

module.exports = {
  userDefaults,
};
