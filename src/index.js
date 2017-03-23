'use strict';


const { startServer } = require('./server');


startServer({
  definitions: require('./example.json'),
  bulkWrite: true,
  bulkDelete: true,
});


module.exports = {
  startServer,
};