'use strict';


const { startServer } = require('./server');
const { propertiesPlugin } = require('./idl');


startServer({
  conf: './examples/pet.schema.yml',
  // Information to send for monitoring
  // Triggered on server startup, shutdowns, requests, errors, logs
  //logger(info) {
  //  const jsonInfo = JSON.stringify(info, null, 2);
  //  global.console.log('Sending to monitoring tool', jsonInfo);
  //},
  // Customize what is logged as `requestInfo`
  loggerFilter: {
    // Can be a mapping function, or a list of attributes
    payload: ({ id }) => id,
    headers: ['host'],
  //   argData,
  //   actionResponses,
  //   response,
  //   params,
  //   queryVars,
  },
  // Can customize logging level, among 'info' (default value), 'log', 'warn',
  // 'error' or 'silent'
  loggerLevel: 'info',
  // arg.data length is limited to 1000 by default.
  // This can be changed, or disabled (using 0)
  maxDataLength: 1000,
  // Pagination default size. Defaults to 100. 0 to disable pagination.
  defaultPageSize: 100,
  // User can override pagination size. This sets an upper limit.
  // Defaults to 100.
  maxPageSize: 100,
  // Project name, used e.g. to namespace HTTP headers
  projectName: 'example_api',
})
// Returns an EventEmitter2 firing the following events: start, error,
// stop.success, stop.fail
// Also has the properties:
//  - options {object} - options passed during initialization
//  - info {object}
//     - info.serverId {string}
//     - info.serverName {string}
//     - info.version {string}
//  - servers {object}
//     - servers.HTTP {Server} - Node.js HTTP server
// Note that `options` and `servers` will only be available after the `start`
// event is fired
.on('start', () => {
  global.console.log('Server started');
})
// If the `error` event handler is not setup, an exception will be
// thrown instead
.on('error', () => {
  global.console.log('Server startup failed');
})
// Can use globbing star
.on('stop.*', () => {
  global.console.log('Server exit');
})
.on('stop.success', () => {
  global.console.log('Server exit (success)');
})
.on('stop.fail', () => {
  global.console.log('Server exit (failure)');
});


module.exports = {
  startServer,
  propertiesPlugin,
};
