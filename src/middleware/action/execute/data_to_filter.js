'use strict';

const { throwError } = require('../../../error');

// Transform `args.data`'s ids into a `args.filter` that can be used by
// the first and the second "read" command
const dataToFilter = function ({ args: { data: dataArg } }) {
  const ids = getDataIds({ dataArg });
  return { id: ids };
};

const getDataIds = function ({ dataArg }) {
  if (Array.isArray(dataArg)) {
    return dataArg.map(datum => getDataId({ model: datum }));
  }

  return getDataId({ model: dataArg });
};

const getDataId = function ({ model, model: { id } }) {
  if (id === undefined) {
    const modelStr = JSON.stringify(model);
    const message = `Missing 'id' in argument 'data': ${modelStr}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return id;
};

module.exports = {
  dataToFilter,
};
