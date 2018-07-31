'use strict';

// Order matters, as first ones will have priority
module.exports = [
  require('./brotli'),
  require('./deflate'),
  require('./gzip'),
  require('./identity'),
];
