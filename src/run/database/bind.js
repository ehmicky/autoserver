'use strict';

const { pick, mapValues } = require('../../utilities');

// Add `options` and `connection` to
// `adapter.find|create|delete|replace|disconnect()` input
const bindAdapters = function ({ adapters, connections, schema, runOpts }) {
  return adapters.map((adapter, index) => bindAdapter({
    adapter,
    options: adapter.options,
    connection: connections[index],
    schema,
    runOpts,
  }));
};

const bindAdapter = function ({ adapter, ...rest }) {
  const methods = pick(adapter, BOUND_METHOD_NAMES);
  const boundMethods = mapValues(
    methods,
    func => boundMethod.bind(null, { func, ...rest }),
  );
  return { ...adapter, ...boundMethods };
};

const BOUND_METHOD_NAMES = ['query', 'disconnect'];

const boundMethod = function ({ func, ...rest }, opts, ...args) {
  return func({ ...opts, ...rest }, ...args);
};

module.exports = {
  bindAdapters,
};
