'use strict';

// Order matters, as first ones will have priority
module.exports = [
  require('./json'),
  require('./yaml'),
  require('./urlencoded'),
  require('./javascript'),
  require('./hjson'),
  require('./json5'),
  require('./ini'),
];
