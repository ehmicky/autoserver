'use strict';

// Default value for options
const applyDefaultOptions = function ({ options, availableOpts }) {
  const optionsB = availableOpts.reduce(
    (optionsA, { name, default: defValue }) =>
      applyDefaultOpt({ options: optionsA, name, defValue }),
    options,
  );
  return { options: optionsB };
};

// Apply `availableOptions` `default` values
const applyDefaultOpt = function ({ options, name, defValue }) {
  if (defValue === undefined) { return options; }

  const recursiveOpt = getRecursiveOpt({ options, name, defValue });
  if (recursiveOpt) { return recursiveOpt; }

  const option = options[name];
  if (option !== undefined) { return options; }

  return { ...options, [name]: defValue };
};

// Recursion over objects, i.e. when name contains dots
const getRecursiveOpt = function ({ options, name, defValue }) {
  const [parent, ...children] = name.split('.');
  if (children.length === 0) { return; }

  const child = options[parent];
  const nameA = children.join('.');
  const val = applyDefaultOpt({ options: child, name: nameA, defValue });

  return { ...options, [parent]: val };
};

module.exports = {
  applyDefaultOptions,
};
