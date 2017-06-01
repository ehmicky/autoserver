'use strict';


const { startServer } = require('./server');
const { propertiesPlugin } = require('./idl');


startServer({
  conf: './examples/pet.schema.yml',
  logger(info) {
    //global.console.log('LOGGER', info);
  },
  // Can customize logging level, among 'info' (default value), 'log', 'warn',
  // 'error' or 'silent'
  // loggerLevel: 'warn',
  // arg.data length is limited to 1000 by default.
  // This can be changed, or disabled (using 0)
  /* maxDataLength: 1000, */
  // Pagination default size. Defaults to 100. 0 to disable pagination.
  /* defaultPageSize: 100, */
  // User can override pagination size. This sets an upper limit.
  // Defaults to 100.
  /* maxPageSize: 100, */
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
