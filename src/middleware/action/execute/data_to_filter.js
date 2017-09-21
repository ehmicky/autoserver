'use strict';

const { throwError } = require('../../../error');

// Transform `args.data`'s ids into a `args.filter` that can be used by
// the first and the second "read" command
const dataToFilter = function ({ args: { data } }) {
  const id = data.map(getDataId);
  return { id };
};

const getDataId = function (model) {
  if (model.id === undefined) {
    const modelStr = JSON.stringify(model);
    const message = `Missing 'id' in argument 'data': ${modelStr}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return model.id;
};

module.exports = {
  dataToFilter,
};
