'use strict';


const { startServer } = require('./server');

const { inspect } = require('util');


Error.stackTraceLimit = 100;

Object.assign(inspect.defaultOptions, {
  colors: true,
  depth: 10,
});

const printer = level => function (...args) {
  const beautifiedArgs = args.map(arg => typeof arg === 'string' ? arg : inspect(arg).replace(/\\n/g, '\n'));
  global.console[level](...beautifiedArgs);
};

startServer({
  conf: './examples/pet.schema.yml',
  // This will be fired on request errors. Startup errors are thrown instead
  /*onRequestError(error) {
    global.console.error('Sending error to monitoring tool', error);
  },*/
  // Can overwrite logging (by default, uses console)
  logger: printer,
})
.then(() => {
  printer('log')('Server started');
})
.catch(exception => {
  printer('error')('Exception at server startup:', exception);
});


module.exports = {
  startServer,
};
