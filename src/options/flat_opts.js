'use strict';

const { throwError } = require('../error');
const { assignArray } = require('../utilities');

// Set `flatOpts`, i.e. all options in a flat array
// Also validates unknown options
const setFlatOpts = function ({ options, availableOpts }) {
  const flatOpts = getFlatOpts({ opt: options, availableOpts });
  return { options, flatOpts };
};

// Recursively validate each option, including intermediate objects
// in object chains
const getFlatOpts = function ({ prefix = '', opt, availableOpts }) {
  if (!opt || opt.constructor !== Object) { return []; }

  return Object.entries(opt)
    .map(([optName, optVal]) =>
      getFlatOpt({ prefix, optName, optVal, availableOpts })
    )
    .reduce(assignArray, []);
};

const getFlatOpt = function ({ prefix, optName, optVal, availableOpts }) {
  const name = `${prefix}${optName}`;
  const {
    validate = {},
    subConfFiles,
  } = getAvailableOpt({ name, availableOpts });

  const flatOpt = [{ name, validate, optVal }];

  // Sub-conf options do not recurse
  // E.g. IDL file is a sub-conf which resolves to an object, but IDL properties
  // are not options themselves
  if (subConfFiles !== undefined) { return flatOpt; }

  const children = getFlatOpts({
    prefix: `${name}.`,
    opt: optVal,
    availableOpts,
  });

  return [...flatOpt, ...children];
};

// Retrieve from `availableOptions`
const getAvailableOpt = function ({ name, availableOpts }) {
  const availableOpt = availableOpts.find(({ name: nameA }) => nameA === name);

  if (!availableOpt) {
    const message = `Option '${name}' is unknown`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  return availableOpt;
};

module.exports = {
  setFlatOpts,
};
