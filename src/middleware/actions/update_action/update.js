'use strict';


const { omit, cloneDeep } = require('lodash');

const { commands } = require('../../../constants');
const { EngineError } = require('../../../error');


// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, models, prefix }) {
  input = cloneDeep(input);

  const isMultiple = input.action.multiple;
  const command = commands.find(({ type, multiple }) => {
    return type === 'update' && multiple === isMultiple;
  });
  const args = getUpdateArgs({ args: input.args, models, prefix });

  Object.assign(input, { command, args });

  return input;
};

const getUpdateArgs = function ({ args, models, prefix }) {
  const { data } = args;
  // arg.filter is only used by first "read" command
  const updateArgs = omit(args, ['filter']);

  if (models instanceof Array) {
    updateArgs.data = models.map(model => {
      return getUpdateData({ model, data, prefix });
    });
  } else {
    updateArgs.data = getUpdateData({ model: models, data, prefix });
  }

  return updateArgs;
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const getUpdateData = function ({ model, data, prefix }) {
  validateUpdateData({ data, prefix });

  const updateData = Object.assign({}, model, data);
  return updateData;
};

const validateUpdateData = function ({ data, prefix }) {
  if (data === undefined) {
    const message = `${prefix} argument 'data' must be defined`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (data.constructor !== Object) {
    const message = `${prefix} argument 'data' must be an object`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }
};


module.exports = {
  getUpdateInput,
};
