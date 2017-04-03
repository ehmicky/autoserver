'use strict';


const { startServer } = require('./server');


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
