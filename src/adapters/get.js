'use strict';

// Retrieve an adapter by its name
const getAdapter = function ({ adapters, key, name }) {
  const adapter = adapters[key];
  if (adapter !== undefined) { return adapter.wrapped; }

  const message = `Unsupported ${name}: '${key}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

// Retrieve all adapters' names
const getNames = function (adapters) {
  return adapters.map(({ name }) => name);
};

// Retrieve all fields of adapters, for a given field
const getMember = function (adapters, member, defaultValue) {
  const members = adapters
    .map(adapter => getAdapterMember({ adapter, member, defaultValue }));
  const membersA = Object.assign({}, ...members);
  return membersA;
};

const getAdapterMember = function ({ adapter, member, defaultValue }) {
  const memberA = adapter[member];
  const memberB = memberA === undefined ? defaultValue : memberA;
  return { [adapter.name]: memberB };
};

module.exports = {
  getAdapter,
  getNames,
  getMember,
};
