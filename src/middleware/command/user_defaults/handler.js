'use strict';


const { applyAllDefault } = require('./apply');


/**
 * Applies schema `default`, if input value is undefined
 * This can be a static value or any JSL
 * Not applied on partial write actions like 'update'
 **/
const userDefaults = function ({ idl, startupLog }) {
  const perf = startupLog.perf.start('command.userDefaults', 'middleware');
  const defMap = getDefMap({ idl });
  perf.stop();

  return async function userDefaults(input) {
    const { args, log } = input;
    const perf = log.perf.start('command.userDefaults', 'middleware');

    if (args.data) {
      const opts = getOptions({ defMap, input });
      args.data = applyAllDefault(opts);
    }

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Retrieves map of models's attributes for which a default value is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const getDefMap = function ({ idl: { models } }) {
  const defMap = Object.entries(models)
    .map(([modelName, { properties = {}, required = [] }]) => {
      const modelDefMap = Object.entries(properties)
        .map(([propName, prop]) => [propName, prop.default])
        .filter(([propName, defValue]) =>
          defValue !== undefined &&
          // Required values do not have default values
          !required.includes(propName)
        );
      const props = new Map(modelDefMap);
      return [modelName, props];
    });
  return new Map(defMap);
};

// Retrieves applyDefault() options from main input
const getOptions = function ({
  defMap,
  input: { modelName, args: { data }, jsl },
}) {
  const defAttributes = defMap.get(modelName);
  return { jsl, defAttributes, value: data };
};


module.exports = {
  userDefaults,
};
