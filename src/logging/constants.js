'use strict';

// When the log was performed
const PHASES = [
  // During server startup
  'startup',
  // During a client request
  'request',
  // During a server shutdown
  'shutdown',
  // For the whole process, e.g. warnings and unhandled promises
  'process',
];

// Why the log was performed
const TYPES = [
  // Generic type
  'message',
  // The server started and is ready to process requests
  'start',
  // The server responded to a client request (either successful or not)
  'call',
  // An exception was thrown or an error occured
  'failure',
  // The server has closed
  'stop',
  // Performance monitoring
  'perf',
];

// Log severity.
const LEVELS = [
  // Debugging information
  'info',
  // Main level, used also for successful operations
  'log',
  // Something wrong happened but might not be a problem
  'warn',
  // Something wrong happened that should be looked at
  'error',
];

module.exports = {
  PHASES,
  TYPES,
  LEVELS,
};
