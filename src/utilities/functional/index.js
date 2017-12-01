'use strict';

module.exports = {
  ...require('./equal'),
  ...require('./includes'),
  ...require('./map'),
  ...require('./reduce'),
  ...require('./flatten'),
  ...require('./filter'),
  ...require('./uniq'),
  ...require('./difference'),
  ...require('./find'),
  ...require('./key_by'),
  ...require('./invert'),
  ...require('./merge'),
  ...require('./get_set'),
  ...require('./path'),
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
