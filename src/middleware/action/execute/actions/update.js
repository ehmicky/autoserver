'use strict';

const readCommand = {
  command: 'read',
};

const updateCommand = function (
  { args: { data: dataArg } },
  { data: currentData },
) {
  const newData = getNewData({ dataArg, currentData });

  return {
    command: 'update',
    args: {
      currentData,
      newData,
    },
  };
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const getNewData = function ({ dataArg, currentData }) {
  return currentData.map(currentDatum => ({ ...currentDatum, ...dataArg }));
};

// "update" action is split into two commands:
//   - first a "read" command retrieving current models
//     Pagination is disabled for that query.
//   - then a "update" command using a merge `newData` of the update data
//     `args.data` and the current models `currentData`
// The reasons why we split "update" action are:
//   - we need to know the current models
//   - we need to know all the attributes of the current model so we can:
//      - use `$$` in the IDL functions used in the next middlewares, including
//        defaults and transforms
//      - perform cross-attributes validation.
//        E.g. if attribute `a` must be equal to attribute `b`, when we update
//        `a`, we need to fetch `b` to check that validation rule.
const updateAction = [
  { mInput: readCommand },
  { mInput: updateCommand },
];

module.exports = {
  update: updateAction,
};
