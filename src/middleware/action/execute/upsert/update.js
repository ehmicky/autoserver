'use strict';

const { getUpdateModels } = require('./split');

// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, input: { args }, data: models }) {
  const newArgs = Object.assign({}, args);
  const updateModels = getUpdateModels({ input, data: models });
  const currentData = getCurrentData({ dataArg: updateModels, models });
  Object.assign(newArgs, {
    pagination: false,
    currentData,
    newData: updateModels,
  });
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
