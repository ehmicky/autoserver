'use strict';


const { readFileSync } = require('fs');

const { startServer } = require('./server');
const { getIdl } = require('./idl');


const definitions = readFileSync('./examples/schema.yml', { encoding: 'utf-8' });
const idl = getIdl(definitions);
startServer({
  idl,
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