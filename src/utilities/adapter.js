'use strict';

const { keyBy, mapValues, pick } = require('./functional');

// Wrap adapters to:
//  - only expose some `members`
//  - add `methods` bound with the adapter as first argument
const wrapAdapters = function ({ adapters, members, methods }) {
  const adaptersA = keyBy(adapters);

  return mapValues(
    adaptersA,
    adapter => wrapAdapter({ adapter, members, methods }),
  );
};

const wrapAdapter = function ({ adapter, members, methods }) {
  const wrapped = classify({ adapter, members, methods });
  return { ...adapter, wrapped };
};

// Similar to create a new class, but more functional programming-oriented
const classify = function ({ adapter, members, methods }) {
  const membersA = pick(adapter, members);
  const methodsA = mapValues(
    methods,
    method => method.bind(null, adapter),
  );
  return { ...membersA, ...methodsA };
};

module.exports = {
  wrapAdapters,
};
