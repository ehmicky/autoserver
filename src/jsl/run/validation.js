'use strict';

const { throwError } = require('../../error');

// Make sure there is no name conflicts between system helpers and
// user-supplied helpers, by forcing the former to be $UPPER_CASE, and
// forbidding the latter to be so
const checkNames = function (input, type) {
  const isSystemType = type === 'SYSTEM';

  for (const name of Object.keys(input)) {
    const isSystemName = systemNameRegExp.test(name);

    if (isSystemType && !isSystemName) {
      const message = `JSL helper named '${name}' should be uppercase/underscore only and start with $`;
      throwError(message, { reason: 'UTILITY_ERROR' });
    } else if (!isSystemType && isSystemName) {
      const message = `JSL helper named '${name}' should not be uppercase/underscore only and start with $`;
      throwError(message, { reason: 'UTILITY_ERROR' });
    }
  }
};

const systemNameRegExp = /^\$[A-Z_]+$/;

module.exports = {
  checkNames,
};
