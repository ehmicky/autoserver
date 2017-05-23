'use strict';


const { omit, cloneDeep } = require('lodash');

const { commands } = require('../../../constants');
const { EngineError } = require('../../../error');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, models }) {
  input = cloneDeep(input);
  const { sysArgs, args, action } = input;

  const isMultiple = action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const updateArgs = getUpdateArgs({ args, models });
  Object.assign(sysArgs, { pagination: isMultiple });
  Object.assign(input, { command, args: updateArgs, sysArgs });

  return input;
};

const getUpdateArgs = function ({ args, models }) {
  const { data } = args;
  // arg.filter is only used by first "read" command
  const updateArgs = omit(args, ['filter']);

  if (models instanceof Array) {
    updateArgs.data = models.map(model => {
      return getUpdateData({ model, data });
    });
  } else {
    updateArgs.data = getUpdateData({ model: models, data });
  }

  return updateArgs;
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const getUpdateData = function ({ model, data }) {
  validateUpdateData({ data });

  const updateData = Object.assign({}, model, data);
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


module.exports = {
  getUpdateInput,
};
