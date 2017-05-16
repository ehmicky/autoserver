'use strict';


const { startServer } = require('./server');
const { propertiesPlugin } = require('./idl');

const { inspect } = require('util');


Error.stackTraceLimit = 100;

Object.assign(inspect.defaultOptions, {
  colors: true,
  depth: 10,
});

const printer = level => function (...args) {
  if (level === 'info') { return; }
  const beautifiedArgs = args.map(arg => {
    return typeof arg === 'string' ? arg : inspect(arg).replace(/\\n/g, '\n');
  });
  global.console[level](...beautifiedArgs);
};

startServer({
  conf: './examples/pet.schema.yml',
  // This will be fired on request errors. Startup errors are thrown instead
  /* onRequestError(error) {
    global.console.error('Sending error to monitoring tool', error);
  }, */
  // Can overwrite logging (by default, uses console)
  logger: printer,
  // arg.data length is limited to 1000 by default.
  // This can be changed, or disabled (using 0)
  /* maxDataLength: 1000, */
  // Pagination default size. Defaults to 100. 0 to disable pagination.
  /* defaultPageSize: 100, */
  // User can override pagination size. This sets an upper limit.
  // Defaults to 100.
  /* maxPageSize: 100, */
})
.then(() => {
  printer('log')('Server started');
})
.catch(exception => {
  printer('error')('Exception at server startup:', exception);
});


module.exports = {
  startServer,
  propertiesPlugin,
};
