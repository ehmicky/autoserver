'use strict';

const pluralize = require('pluralize');

const { assignArray } = require('../../../utilities');
const { throwError } = require('../../../error');

// Retrieve options that are dynamic, e.g. protocols and databases
const getDynamicOpts = function ({ name, title, handlers, commonOpts = [] }) {
  const topOpt = getTopOpt({ name, title });
  const optsA = getOpts({ handlers, name, title, commonOpts });

  return [
    topOpt,
    ...optsA,
  ];
};

// E.g. `runOpts.protocols`
const getTopOpt = function ({ name, title }) {
  const titleA = pluralize(title);

  return {
    name,
    description: `${titleA} options`,
    group: titleA,
    default: {
      http: {},
    },
    validate: {
      type: 'object',
    },
  };
};

// Retrieve dynamic options, e.g. `runOpts.protocols.*`
const getOpts = function ({ handlers, name, title, commonOpts }) {
  return Object.values(handlers)
    .map(handler => getEachOpts({ handler, name, title, commonOpts }))
    .reduce(assignArray, []);
};

// Reuse `handler.opts`, and automatically adds some properties
const getEachOpts = function ({
  handler: { name: handlerName, title: handlerTitle, description, opts },
  name,
  title,
  commonOpts,
}) {
  opts.forEach(opt => validateOpt({ opt, name, title, commonOpts }));

  // Add `handler.description`
  const mainOptA = { ...mainOpt, description };
  return [mainOptA, ...commonOpts, ...opts]
    // Add `handler.title` to option group
    .map(opt => ({ ...opt, group: `${pluralize(title)} (${handlerTitle})` }))
    .map(({ name: optName, ...opt }) => ({
      name: getName({ name, handlerName, optName }),
      ...opt,
    }));
};

const validateOpt = function ({
  opt: { name: optName },
  name,
  title,
  commonOpts,
}) {
  const commonOpt = commonOpts.find(({ name: nameA }) => nameA === optName);
  if (commonOpt === undefined) { return; }

  const message = `${title} '${name}' cannot specify an option named '${commonOpt.name}' because it is already a common option`;
  throwError(message, { reason: 'UTILITY_ERROR' });
};

// Main option.
// `description` is automatically added.
const mainOpt = {
  name: '',
  default: { enabled: false },
  validate: {
    type: 'object',
  },
};

// Prepend `.TYPE` to options
const getName = function ({ name, handlerName, optName }) {
  return optName === ''
    ? `${name}.${handlerName}`
    : `${name}.${handlerName}.${optName}`;
};

module.exports = {
  getDynamicOpts,
};
