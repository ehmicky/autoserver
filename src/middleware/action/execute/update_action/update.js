'use strict';


const { omit, cloneDeep } = require('lodash');

const { commands } = require('../../../../constants');
const { EngineError } = require('../../../../error');
const { isJsl } = require('../../../../jsl');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, models }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);
  input.sysArgs = cloneDeep(input.sysArgs);

  const { sysArgs, args, action, jsl } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const updateArgs = getUpdateArgs({ args, models, jsl });
  Object.assign(sysArgs, { pagination: isMultiple });
  Object.assign(input, { command, args: updateArgs, sysArgs });

  return input;
};

const getUpdateArgs = function ({ args, models, jsl }) {
  const { data } = args;
  // arg.filter is only used by first "read" command
  const updateArgs = omit(args, ['filter']);

  // Keys in arg.* using JSL
  const jslKeys = Object.keys(data)
    .filter(key => isJsl({ jsl: data[key] }));

  if (models instanceof Array) {
    updateArgs.data = models.map(model => {
      return getUpdateData({ model, data, jsl, jslKeys });
    });
  } else {
    updateArgs.data = getUpdateData({ model: models, data, jsl, jslKeys });
  }

  return updateArgs;
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const getUpdateData = function ({ model, data, jsl, jslKeys }) {
  validateUpdateData({ data });

  const transformedData = transformData({ model, data, jsl, jslKeys });

  const updateData = Object.assign({}, model, transformedData);
  return updateData;
};

const validateUpdateData = function ({ data }) {
  if (data === undefined) {
    const message = 'Argument \'data\' must be defined';
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (data.constructor !== Object) {
    const message = 'Argument \'data\' must be an object';
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }
};

// Apply arg.data JSL
const transformData = function ({ model, data, jsl, jslKeys }) {
  data = Object.assign({}, data);

  for (const attrName of jslKeys) {
    // If current attribute value is null|undefined, leave it as is
    // This simplifies JSL, as $ is guaranteed to be defined
    if (model[attrName] == null) {
      data[attrName] = model[attrName];
      continue;
    }

    const params = { $$: model, $: model[attrName] };
    data[attrName] = jsl.run({ value: data[attrName], params, type: 'data' });
  }

  return data;
};


module.exports = {
  getUpdateInput,
};
