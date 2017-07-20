'use strict';

const { getUpdateModels } = require('./split');

// Retrieves the input for the "update" command
const getUpdateInput = function ({ input, data: models }) {
  const updateModels = getUpdateModels({ input, data: models });
  return {
    command: 'update',
    args: {
      pagination: false,
      currentData: getCurrentData({ dataArg: updateModels, models }),
      newData: updateModels,
    },
  };
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
