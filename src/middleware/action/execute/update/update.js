'use strict';

const { cloneDeep } = require('lodash');

const { omit } = require('../../../../utilities');
const { COMMANDS } = require('../../../../constants');
const { isJsl } = require('../../../../jsl');

// Retrieves the input for the "update" command
const getUpdateInput = function ({ input: oInput, models }) {
  const input = Object.assign({}, oInput);
  input.args = cloneDeep(input.args);

  const { args, action, jsl } = input;

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) =>
    type === 'update' && multiple === isMultiple
  );
  const newArgs = getUpdateArgs({ args, models, jsl });
  Object.assign(newArgs, { pagination: isMultiple, currentData: models });
  Object.assign(input, { command, args: newArgs });

  return input;
};

const getUpdateArgs = function ({ args, models, jsl }) {
  const { data } = args;
  // `args.filter` is only used by first "read" command
  const updateArgs = omit(args, ['filter', 'data']);

  // Keys in args.* using JSL
  const jslKeys = Object.keys(data)
    .filter(key => isJsl({ jsl: data[key] }));

  if (Array.isArray(models)) {
    updateArgs.newData = models.map(model =>
      getUpdateData({ model, data, jsl, jslKeys })
    );
  } else {
    updateArgs.newData = getUpdateData({ model: models, data, jsl, jslKeys });
  }

  return updateArgs;
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const getUpdateData = function ({ model, data, jsl, jslKeys }) {
  const transformedData = transformData({ model, data, jsl, jslKeys });

  const updateData = Object.assign({}, model, transformedData);
  return updateData;
};

// Apply args.data JSL
const transformData = function ({ model, data, jsl, jslKeys }) {
  const transformedData = jslKeys.map(attrName => {
    const newData = getNewData({ data, model, attrName, jsl });
    return { [attrName]: newData };
  });

  return Object.assign({}, data, ...transformedData);
};

const getNewData = function ({ data, model, attrName, jsl }) {
  // If current attribute value is null|undefined, leave it as is
  // This simplifies JSL, as $ is guaranteed to be defined
  if (model[attrName] == null) { return null; }

  const params = { $$: model, $: model[attrName] };
  return jsl.run({ value: data[attrName], params, type: 'data' });
};

module.exports = {
  getUpdateInput,
};
