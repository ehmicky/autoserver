'use strict';

const getCurrentData = function ({ dataArg, models }) {
  if (!Array.isArray(dataArg)) { return models; }

  return dataArg.map(newDatum => getCurrentDatum({ models, newDatum }));
};

const getCurrentDatum = function ({ models, newDatum }) {
  const currentDatum = models.find(model => model.id === newDatum.id);
  return currentDatum || null;
};

module.exports = {
  getCurrentData,
};
