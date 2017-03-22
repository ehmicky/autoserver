'use strict';


const { startServer } = require('./server');


startServer({
  definitions: require('./example.json'),
});


module.exports = {
  startServer,
};