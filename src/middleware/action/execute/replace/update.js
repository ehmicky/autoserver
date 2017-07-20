'use strict';

const { omit } = require('../../../../utilities');

// Retrieves the input for the "update" command
const getUpdateInput = function ({ input: { args }, data: models }) {
  const newArgs = omit(args, ['data']);
  const currentData = getCurrentData({ dataArg: args.data, models });
  const newData = args.data;

  Object.assign(newArgs, { pagination: false, currentData, newData });
  return { command: 'update', args: newArgs };
};

const getCurrentData = function ({ dataArg, models }) {
  if (!Array.isArray(models)) { return models; }

  return dataArg.map(newDatum => {
    const currentDatum = models.find(model => model.id === newDatum.id);
    return currentDatum || null;
  });
};

module.exports = {
  getUpdateInput,
};
