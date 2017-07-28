'use strict';

const { throwError } = require('../../error');
const { mapKeys } = require('../../utilities');

// Make sure there is no name conflicts between system helpers and
// user-supplied helpers, by forcing the former to be $UPPER_CASE, and
// forbidding the latter to be so
const checkNames = function ({ params, type }) {
  return mapKeys(params, (value, name) => checkName({ name, type }));
};

const checkName = function ({ name, type }) {
  const isSystemName = systemNameRegExp.test(name);

  if (type === 'SYSTEM' && !isSystemName) {
    const message = `JSL helper named '${name}' should be uppercase/underscore only and start with $`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  if (type !== 'SYSTEM' && isSystemName) {
    const message = `JSL helper named '${name}' should not be uppercase/underscore only and start with $`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  return name;
};

const systemNameRegExp = /^\$[A-Z_]+$/;

const validateType = function ({ type }) {
  if (!validTypes.includes(type)) {
    const message = `Invalid JSL type: '${type}'`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

const validTypes = ['system', 'startup', 'data', 'filter'];

module.exports = {
  checkNames,
  validateType,
};
