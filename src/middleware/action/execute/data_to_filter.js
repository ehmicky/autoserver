'use strict';

const { EngineError } = require('../../../error');

// Transform `args.data`'s ids into a `args.filter` that can be used by
// the first and the second "read" command
const dataToFilter = function ({ args: { data: dataArg } }) {
  const ids = getDataIds({ dataArg });
  const idsJsl = idsToJsl({ ids });
  return idsJsl;
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
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  return id;
};

const idsToJsl = function ({ ids }) {
  const idsStr = JSON.stringify(ids);

  if (Array.isArray(ids)) {
    return `(${idsStr}.includes($$.id))`;
  }

  return `(($$.id === ${idsStr}))`;
};

module.exports = {
  dataToFilter,
};
