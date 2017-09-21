'use strict';

const { getCurrentData } = require('../current_data');
const { dataToFilter } = require('../data_to_filter');

const readCommand = ({ args }) => ({
  command: 'read',

  args: {
    filter: dataToFilter({ args }),
  },
});

const upsertCommand = function (
  { args: { data: dataArg } },
  { data: models },
) {
  const currentData = getCurrentData({ dataArg, models });

  return {
    command: 'upsert',
    args: {
      currentData,
      newData: dataArg,
    },
  };
};

// "upsert" action is exactly like "replace", except:
//  - the first "read" command is multiple, since model might not exist
//  - the final command is called "upsert", i.e. it is meant to be
//    either "create" or "update" for each model.
const upsertAction = [
  { mInput: readCommand },
  { mInput: upsertCommand },
];

module.exports = {
  upsert: upsertAction,
};
