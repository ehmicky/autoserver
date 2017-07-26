'use strict';

module.exports = Object.assign(
  {},
  require('./map'),
  require('./reduce'),
  require('./filter'),
  require('./invert'),
  require('./merge'),
  require('./immutable'),
  require('./memoize'),
  require('./once'),
  require('./buffer'),
  require('./identity'),
  // eslint-disable-next-line import/max-dependencies
  require('./group'),
);
