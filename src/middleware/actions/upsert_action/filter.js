'use strict';


const { EngineError } = require('../../../error');


// Transform `args.data`'s ids into a `args.filter` that can be used by
// the first and the second "read" database actions
const getFilter = function ({ input, prefix }) {
  const ids = getDataIds({ input, prefix });
  if (ids instanceof Array) {
    return `(${JSON.stringify(ids)}.includes($$.id))`;
  } else {
    return `(($$.id === ${JSON.stringify(ids)}))`;
  }
};

const getDataIds = function ({ input: { args: { data } }, prefix }) {
  if (data instanceof Array) {
    return data.map(datum => getDataId({ data: datum, prefix }));
  } else {
    return getDataId({ data, prefix });
  }
};

const getDataId = function ({ data, prefix }) {
  const { id } = data;

  if (id === undefined) {
    const model = JSON.stringify(data);
    const message = `${prefix} missing 'id' in argument 'data': ${model}`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  return id;
};


module.exports = {
  getFilter,
};
