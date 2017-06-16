'use strict';


const { mapValues, pickBy } = require('../../../utilities');
const { applyAllDefault } = require('./apply');


/**
 * Applies schema `default`, if input value is undefined
 * This can be a static value or any JSL
 * Not applied on partial write actions like 'update'
 **/
const userDefaults = function ({ idl }) {
  const defMap = getDefMap({ idl });

  return async function userDefaults(input) {
    const { args, log, modelName, jsl } = input;
    const { newData } = args;
    const perf = log.perf.start('command.userDefaults', 'middleware');

    if (args.newData) {
      const defAttributes = defMap[modelName];
      args.newData = applyAllDefault({ jsl, defAttributes, value: newData });
    }

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Retrieves map of models's attributes for which a default value is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const getDefMap = function ({ idl: { models } }) {
  return mapValues(models, ({ properties = {}, required = [] }) => {
    const propDefaults = mapValues(properties, prop => prop.default);
    return pickBy(propDefaults, (defValue, propName) =>
      // Required values do not have default values
      defValue !== undefined && !required.includes(propName)
    );
  });
};


module.exports = {
  userDefaults,
};
