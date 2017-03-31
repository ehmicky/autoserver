'use strict';


const { readFileSync } = require('fs');

const { startServer } = require('./server');


startServer({
  definitions: readFileSync('./examples/schema.json', { encoding: 'utf-8' }),
}).catch(exception => {
  global.console.error('Exception at server startup:', exception);
});


module.exports = {
  startServer,
};