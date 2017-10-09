'use strict';

const { runSchemaFunc } = require('../../../schema_func');

// Apply default values to args.data's models
const applyAllDefault = function ({ data, defAttributes, mInput }) {
  return data
    .map(datum => applyDataDefault({ data: datum, defAttributes, mInput }));
};

const applyDataDefault = function ({ data, defAttributes, mInput }) {
  // Iterate over default values for that model, to apply them
  return Object.entries(defAttributes).reduce(
    (parent, [attrName, defValue]) =>
      applyDefault({ parent, defValue, attrName, mInput }),
    data,
  );
};

// Apply default value to args.data's attributes
const applyDefault = function ({ parent, defValue, attrName, mInput }) {
  const value = parent[attrName];

  // Only apply default if value is not empty
  if (value != null) { return parent; }

  // Process inline functions if default value contains any
  const vars = { $$: parent };
  const defValueA = runSchemaFunc({ schemaFunc: defValue, mInput, vars });

  if (defValueA == null) { return parent; }

  return { ...parent, [attrName]: defValueA };
};

module.exports = {
  applyAllDefault,
};
