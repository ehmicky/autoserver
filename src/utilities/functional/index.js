'use strict';

module.exports = {
  ...require('./equal'),
  ...require('./map'),
  ...require('./reduce'),
  ...require('./filter'),
  ...require('./find'),
  ...require('./key_by'),
  ...require('./invert'),
  ...require('./merge'),
  ...require('./get_set'),
  ...require('./result'),
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
