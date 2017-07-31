'use strict';

// This is a global variable, i.e. affects calling code,
// but we do want big stack traces.
// eslint-disable-next-line fp/no-mutation
Error.stackTraceLimit = 100;

module.exports = {};
