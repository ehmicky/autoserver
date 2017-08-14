'use strict';

// When the event was performed
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

// Why the event was performed
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

const ALL_TYPES = [
  ...TYPES,
  // Special type that includes all the other types
  'any',
];

// Those event types never prints to console
const NO_CONSOLE_TYPES = ['perf'];

// Event severity.
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

// Map a request status to a event level
const STATUS_LEVEL_MAP = {
  INTERNALS: 'debug',
  SUCCESS: 'log',
  CLIENT_ERROR: 'warn',
  SERVER_ERROR: 'error',
};

module.exports = {
  PHASES,
  TYPES,
  ALL_TYPES,
  NO_CONSOLE_TYPES,
  LEVELS,
  STATUS_LEVEL_MAP,
};
