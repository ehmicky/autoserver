'use strict';


const { runJsl } = require('../../jsl');
const { EngineError } = require('../../error');


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
  const input = Object.assign({}, jslInput, {
    $$: parent,
    $DATA: parent,
    $: value,
  });
  try {
    defValue = runJsl(defValue, input);
  } catch (innererror) {
    const message = `JSL expression used as transform failed: '${defValue.jsl}'`;
    throw new EngineError(message, { reason: 'WRONG_TRANSFORM', innererror });
  }

  parent[attrName] = defValue;
};


module.exports = {
  applyAllDefault,
};
