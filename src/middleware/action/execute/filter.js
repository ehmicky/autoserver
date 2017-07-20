'use strict';

const { EngineError } = require('../../../error');

// Transform `args.data`'s ids into a `args.filter` that can be used by
// the first and the second "read" command
const getFilter = function ({ argData }) {
  const ids = getDataIds({ argData });
  const idsJsl = idsToJsl({ ids });
  return idsJsl;
};

const getDataIds = function ({ argData }) {
  if (Array.isArray(argData)) {
    return argData.map(datum => getDataId({ model: datum }));
  }

  return getDataId({ model: argData });
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
  getFilter,
};
