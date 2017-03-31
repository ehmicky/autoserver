'use strict';


module.exports = Object.assign(
  {},
  { definitions: require('./schema.json') },
  require('./parse'),
  require('./operations')
);