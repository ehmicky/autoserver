'use strict';

const { dataToFilter } = require('../data_to_filter');
const { getCurrentData } = require('../current_data');

const readCommand = ({ args: { data: dataArg } }) => ({
  commandType: 'read',
  // We want to avoid 404 (since models might exist or not)
  // that might arise when using non-multiple command
  commandMultiple: true,

  args: {
    filter: dataToFilter({ dataArg }),
    pagination: false,
  },
});

const upsertCommand = function (
  { args: { data: dataArg }, action: { multiple: isMultiple } },
  { data: models },
) {
  const currentDataArray = getCurrentData({ dataArg, models });
  // Revert the effects of `commandMultiple: true`
  const currentData = isMultiple ? currentDataArray : currentDataArray[0];

  return {
    commandType: 'upsert',
    args: {
      pagination: false,
      currentData,
      newData: dataArg,
    },
  };
};

/**
 * "upsert" action is exactly like "replace", except:
 *  - the first "read" command is multiple, since model might not exist
 *  - the final command is called "upsert", i.e. it is meant to be
 *    either "create" or "update" for each model.
 **/
const upsertAction = [
  { input: readCommand },
  { input: upsertCommand },
];

module.exports = {
  upsert: upsertAction,
};
