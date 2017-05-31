'use strict';


const { startServer } = require('./server');
const { propertiesPlugin } = require('./idl');

const { inspect } = require('util');


Error.stackTraceLimit = 100;

Object.assign(inspect.defaultOptions, {
  colors: true,
  depth: 10,
});

const dirPrefix = /\/home\/ether\/api-engine/g;

const printer = level => function (...args) {
  if (level === 'info') { return; }
  const beautifiedArgs = args.map(arg => {
    const message = typeof arg === 'string'
      ? arg
      : inspect(arg).replace(/\\n/g, '\n');
    return message.replace(dirPrefix, '');
  });
  global.console[level](...beautifiedArgs);
};

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
.catch(exception => {
  global.console.error('Exception at server startup:', exception);
});


module.exports = {
  startServer,
  propertiesPlugin,
};
