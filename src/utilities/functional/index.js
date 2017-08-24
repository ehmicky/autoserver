'use strict';

module.exports = {
  ...require('./map'),
  ...require('./reduce'),
  ...require('./filter'),
  ...require('./find'),
  ...require('./invert'),
  ...require('./merge'),
  ...require('./get_set'),
  ...require('./immutable'),
  ...require('./memoize'),
  ...require('./once'),
  ...require('./identity'),
  ...require('./group'),
  ...require('./sort'),
  ...require('./reverse'),
  ...require('./promise'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./func_name'),
};
