'use strict';

module.exports = Object.assign(
  {},
  require('./map'),
  require('./recurse_map'),
  require('./reduce'),
  require('./filter'),
  require('./transform'),
  require('./invert'),
  require('./merge'),
  require('./immutable'),
  require('./memoize'),
  require('./once'),
  require('./buffer'),
  // eslint-disable-next-line import/max-dependencies
  require('./identity'),
);
