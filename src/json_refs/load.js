'use strict';

const { getWordsList } = require('../utilities');
const { addGenErrorHandler, throwError } = require('../error');
const { loadFile } = require('../formats');

// Load the file pointing to by the JSON reference
const load = function ({ path, hasSiblings, varKeys }) {
  const allow = getAllow({ path, hasSiblings, varKeys });
  return loadFile({ type: 'conf', path, allow });
};

const eLoad = addGenErrorHandler(load, {
  message: ({ path }) => `JSON reference '${path}' is invalid: this file does not exist or has syntax errors`,
  reason: 'SCHEMA_SYNTAX_ERROR',
});

// Generally speaking, we only allow JSON compatible types.
// Formats loader takes care of removing any non-JSON types.
// However, we allow some exceptions:
//  - anything under `schema.variables` can be any type, since it is not
//    normalized, and we want to allow for example using a RegExp as a
//    server-specific variable, or a library like Lodash
//  - it is possible to import functions with JSON references. We do not allow
//    functions that also behave like objects (e.g. Lodash main exported
//    variable)
//  - we do not allow any of the above if the JSON reference is deeply merged
//    with siblings
const getAllow = function ({ path, hasSiblings, varKeys }) {
  if (hasSiblings) { return; }

  const isServerVar = varKeys[0] === 'variables';
  if (isServerVar) { return allowAll; }

  return allowFunctions.bind(null, path);
};

const allowAll = () => true;

const allowFunctions = function (path, value) {
  if (typeof value !== 'function') { return false; }

  const members = Object.keys(value);
  if (members.length === 0) { return true; }

  const membersA = getWordsList(members, { op: 'and', quotes: true });
  const message = `JSON reference '${path}' is invalid: the exported function must not have any properties, but it has the following ones: ${membersA}`;
  throwError(message, { reason: 'SCHEMA_SYNTAX_ERROR' });
};

module.exports = {
  load: eLoad,
};
