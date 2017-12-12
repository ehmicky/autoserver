'use strict';

const { addErrorHandler } = require('../../error');

// Some config variables are filtered out in logs and in error responses
// because they can get too big, e.g. `args.data`, `response.data` and `payload`
// `sumVars` summarize them by their size and length, e.g. `payloadsize` and
// `payloadcount`
const getSumVars = function ({ attrName, value }) {
  if (value === undefined) { return; }

  const size = eGetSize({ attrName, value });
  const count = getCount({ attrName, value });
  return { ...size, ...count };
};

const getSize = function ({ attrName, value }) {
  const size = JSON.stringify(value).length;
  const name = `${attrName}size`;
  return { [name]: size };
};

// Returns `size` `undefined` if not JSON
const eGetSize = addErrorHandler(getSize);

const getCount = function ({ attrName, value }) {
  if (!Array.isArray(value)) { return; }

  const count = value.length;
  const name = `${attrName}count`;
  return { [name]: count };
};

module.exports = {
  getSumVars,
};
