'use strict';

const { applyAllDefault } = require('./apply');

/**
 * Applies schema `default`, if input value is undefined
 * This can be a static value or any JSL
 * Not applied on partial write actions like 'update'
 **/
const userDefaults = async function (input) {
  const {
    args,
    log,
    modelName,
    jsl,
    idl: { shortcuts: { userDefaultsMap } },
  } = input;
  const { newData } = args;
  const perf = log.perf.start('command.userDefaults', 'middleware');

  if (args.newData) {
    const defAttributes = userDefaultsMap[modelName];
    args.newData = applyAllDefault({ jsl, defAttributes, value: newData });
  }

  perf.stop();
  const response = await this.next(input);
  return response;
};

module.exports = {
  userDefaults,
};
