'use strict';

const { mapValues } = require('../../utilities');

const { getParams } = require('./values');

// Retrieve all server-specific parameters.
// Functions are bound with parameters.
const getServerParams = function ({ config, mInput }) {
  const params = getParams(mInput);

  // Only pass parameters to config.params.* not config.params.*.*
  const serverParams = mapValues(
    config.params,
    serverParam => bindServerParam({ serverParam, params }),
  );

  // Allow server-specific parameters to call each other
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(params, serverParams);

  return serverParams;
};

// Add parameters to every server-specific parameter that is a
// function, as a first bound parameter
const bindServerParam = function ({ serverParam, params }) {
  // Constants are left as is, including object containing functions
  if (typeof serverParam !== 'function') { return serverParam; }

  // Same as `serverParam.bind(null, params)`, except works when `serverParam`
  // is both a function and an object with a `bind` member, e.g. Lodash
  // main object.
  const serverParamA = Function.prototype.bind.call(serverParam, null, params);

  // Keep static member
  // E.g. Underscore/Lodash main exported object is both a function and an
  // object with function members
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(serverParamA, serverParam);

  return serverParamA;
};

module.exports = {
  getServerParams,
};
