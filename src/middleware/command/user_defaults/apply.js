'use strict';

const { runJsl } = require('../../../jsl');

// Apply default values to args.data's models
const applyAllDefault = function applyAllDefault (opts) {
  const { defAttributes, value, idl } = opts;

  // When args.data is an array of models, apply this recursively
  if (Array.isArray(value)) {
    return value.map(child =>
      applyAllDefault(Object.assign({}, opts, { value: child }))
    );
  }

  // Iterate over default values for that model, to apply them
  const parent = value;

  for (const [attrName, defValue] of Object.entries(defAttributes)) {
    const childOpts = Object.assign(
      {},
      opts,
      { defValue, attrName, parent, idl },
    );
    applyDefault(childOpts);
  }

  return value;
};

// Apply default value to args.data's attributes
const applyDefault = function ({ parent, defValue, attrName, jsl, idl }) {
  const value = parent[attrName];

  // Only apply default if value is not defined by client
  if (value !== undefined) { return; }

  // Process JSL if default value uses JSL
  const params = { $$: parent, $: value };
  const defValueA = runJsl({ jsl, value: defValue, params, idl });

  parent[attrName] = defValueA;
};

module.exports = {
  applyAllDefault,
};
