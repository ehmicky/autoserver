'use strict';


const { startServer } = require('./server');


Error.stackTraceLimit = 100;

startServer({
  conf: './examples/pet.schema.yml',
  // This will be fired on request errors. Startup errors are thrown instead
  /*onRequestError(error) {
    global.console.error('Sending error to monitoring tool', error);
  },*/
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
