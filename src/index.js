'use strict';


const { startServer } = require('./server');


Error.stackTraceLimit = 100;

startServer({
  conf: './examples/schema.yml',
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
