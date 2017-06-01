'use strict';


const { startServer } = require('./server');
const { propertiesPlugin } = require('./idl');


startServer({
  conf: './examples/pet.schema.yml',
  // Information to send for monitoring
  // Triggered on server startup, shutdowns, requests, errors, logs
  //logger(info) {
  //  global.console.log('Sending to monitoring tool', JSON.stringify(info, null, 2));
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
.then(() => {
  global.console.log('Server started');
})
.catch(() => {
  global.console.error('Exception at server startup');
});


module.exports = {
  startServer,
  propertiesPlugin,
};
