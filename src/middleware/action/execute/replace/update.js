'use strict';

// Retrieves the input for the "update" command
const getUpdateInput = function ({
  input: { args: { data: dataArg } },
  data: models,
}) {
  return {
    command: 'update',
    args: {
      pagination: false,
      currentData: getCurrentData({ dataArg, models }),
      newData: dataArg,
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
