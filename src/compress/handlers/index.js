'use strict';

// Order matters, as first ones will have priority
module.exports = [
  require('./identity'),
  require('./deflate'),
  require('./gzip'),
  require('./brotli'),
];
