'use strict';


module.exports = Object.assign(
  {},
  { definitions: require('./example.json') },
  require('./parse'),
  require('./operations')
);