'use strict';


const { startServer } = require('./server');


Error.stackTraceLimit = 100;

startServer({
  conf: './examples/pet.schema.yml',
  // This will be fired on request errors. Startup errors are thrown instead
  /*onRequestError(error) {
    global.console.error('Sending error to monitoring tool', error);
  },*/
  // Can overwrite logging (by default, uses console)
  //logger: level => global.console[level].bind(global.console),
})
.then(() => {
  global.console.log('Server started');
})
.catch(exception => {
  global.console.error('Exception at server startup:', exception);
});


module.exports = {
  startServer,
};
