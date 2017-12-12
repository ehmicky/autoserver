'use strict';

const { pick, mapValues } = require('../../utilities');

// Add `options`, `connection` and `config` to
// `adapter.query|disconnect()` input
const bindAdapters = function ({ adapters, connections, config }) {
  return adapters.map((adapter, index) => bindAdapter({
    adapter,
    options: adapter.options,
    connection: connections[index],
    config,
  }));
};

const bindAdapter = function ({ adapter, ...rest }) {
  const funcs = pick(adapter, BOUND_FUNC_NAMES);
  const boundFuncs = mapValues(
    funcs,
    func => boundFunc.bind(null, { func, ...rest }),
  );
  return { ...adapter, ...boundFuncs };
};

const BOUND_FUNC_NAMES = ['query', 'disconnect'];

const boundFunc = function ({ func, ...rest }, opts, ...args) {
  return func({ ...opts, ...rest }, ...args);
};

module.exports = {
  bindAdapters,
};
