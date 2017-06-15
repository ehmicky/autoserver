'use strict';


const { cloneDeep } = require('lodash');

const { omit } = require('../../../../utilities');
const { COMMANDS } = require('../../../../constants');
const { EngineError } = require('../../../../error');
const { isJsl } = require('../../../../jsl');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, models }) {
  input = Object.assign({}, input);
  input.args = cloneDeep(input.args);

  const { args, action, jsl } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const newArgs = getUpdateArgs({ args, models, jsl });
  Object.assign(newArgs, { pagination: isMultiple, currentData: models });
  Object.assign(input, { command, args: newArgs });

  return input;
};

const getUpdateArgs = function ({ args, models, jsl }) {
  const { data } = args;
  // args.filter is only used by first "read" command
  const updateArgs = omit(args, ['filter', 'data']);

  // Keys in args.* using JSL
  const jslKeys = Object.keys(data)
    .filter(key => isJsl({ jsl: data[key] }));

  if (models instanceof Array) {
    updateArgs.newData = models.map(model => {
      return getUpdateData({ model, data, jsl, jslKeys });
    });
  } else {
    updateArgs.newData = getUpdateData({ model: models, data, jsl, jslKeys });
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

// Apply args.data JSL
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
