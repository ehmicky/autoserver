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
// Returns an EventEmitter2 firing the following events
// Also has the properties:
//  - options {object}
//  - serverId {string}
//  - serverName {string}
//  - version {string}
.on('start', () => {
  global.console.log('Server started');
})
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
