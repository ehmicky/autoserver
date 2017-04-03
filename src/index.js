'use strict';


const { readFileSync } = require('fs');

const { startServer } = require('./server');
const { getIdl } = require('./idl');


const definitions = readFileSync('./examples/schema.yml', { encoding: 'utf-8' });
const idl = getIdl(definitions);
startServer({
  idl,
}).catch(exception => {
  global.console.error('Exception at server startup:', exception);
});


module.exports = {
  startServer,
};