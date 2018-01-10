'use strict';

// Retrieve an adapter by its name
const getAdapter = function ({ adapters, key, name }) {
  const adapter = adapters[key];
  if (adapter !== undefined) { return adapter.wrapped; }

  const message = `Unsupported ${name}: '${key}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  getAdapter,
};
