'use strict';


// Apply default values to args.data's models
const applyAllDefault = function applyAllDefault(opts) {
  const { defAttributes, value } = opts;

  // When arg.data is an array of models, apply this recursively
  if (value instanceof Array) {
    return value.map(child => {
      return applyAllDefault(Object.assign({}, opts, { value: child }));
    });
  }

  // Value should be an object if valid, but it might be invalid since
  // the validation layer is not fired yet on input
  if (value.constructor !== Object) { return value; }

  // Iterate over default values for that model, to apply them
  const parent = value;
  for (const [attrName, defValue] of defAttributes) {
    const childOpts = Object.assign({}, opts, { defValue, attrName, parent });
    applyDefault(childOpts);
  };

  return value;
};

// Apply default value to args.data's attributes
const applyDefault = function ({ parent, defValue, attrName, jslInput }) {
  const value = parent[attrName];

  // Only apply default if value is not defined by client
  if (value !== undefined) { return; }

  // Process JSL if default value uses JSL
  const input = { $$: parent, $: value };
  const newDefValue = jslInput.run(defValue, input);

  parent[attrName] = newDefValue;
};


module.exports = {
  applyAllDefault,
};
