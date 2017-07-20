'use strict';

const { getFilter } = require('./filter');

const readCommand = ({ args: { data: argData } }) => ({
  command: 'read',
  args: {
    filter: getFilter({ argData }),
    pagination: false,
  },
});

const updateCommand = ({ args: { data: dataArg } }, { data: models }) => ({
  command: 'update',
  args: {
    pagination: false,
    currentData: getCurrentData({ dataArg, models }),
    newData: dataArg,
  },
});

const getCurrentData = function ({ dataArg, models }) {
  if (!Array.isArray(models)) { return models; }

  return dataArg.map(newDatum => {
    const currentDatum = models.find(model => model.id === newDatum.id);
    return currentDatum || null;
  });
};

/**
 * "replace" action is split into two commands:
 *   - first a "read" command retrieving current models
 *     Pagination is disabled for that query.
 *   - then a "update" command
 * The reasons why we split "replace" action are:
 *   - we need to know the current models so we can set args.currentData
 **/
const replaceAction = [
  { input: readCommand },
  { input: updateCommand },
];

module.exports = {
  replaceAction,
};
