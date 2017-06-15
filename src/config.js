'use strict';


// TODO: use proper configuration framework
const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 5001,
};


module.exports = config;
