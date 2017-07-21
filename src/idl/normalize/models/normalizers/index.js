'use strict';

module.exports = Object.assign(
  {},
  require('./transform'),
  require('./alias'),
  require('./types'),
  require('./transformer'),
);
