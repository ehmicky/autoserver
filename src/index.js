'use strict';


const { startServer } = require('./server');


startServer({
  definitions: require('./idl').definitions,
}).catch(exception => {
  global.console.error('Exception at server startup:', exception);
});


module.exports = {
  startServer,
};