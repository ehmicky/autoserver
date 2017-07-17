'use strict';

// This is a global variable, i.e. affects calling code,
// but we do want big stack traces.
Error.stackTraceLimit = 100;

module.exports = {};
