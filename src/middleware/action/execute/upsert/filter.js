'use strict';

const { EngineError } = require('../../../../error');

// Transform `args.data`'s ids into a `args.filter` that can be used by
// the first and the second "read" command
const getFilter = function ({ input }) {
  const ids = getDataIds({ input });
  if (ids instanceof Array) {
    return `(${JSON.stringify(ids)}.includes($$.id))`;
  } else {
    return `(($$.id === ${JSON.stringify(ids)}))`;
  }
};

const getDataIds = function ({ input: { args: { data } } }) {
  if (data instanceof Array) {
    return data.map(datum => getDataId({ data: datum }));
  } else {
    return getDataId({ data });
  }
};

const getDataId = function ({ data }) {
  const { id } = data;

  if (id === undefined) {
    const model = JSON.stringify(data);
    const message = `Missing 'id' in argument 'data': ${model}`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  return id;
};

module.exports = {
  getFilter,
};
