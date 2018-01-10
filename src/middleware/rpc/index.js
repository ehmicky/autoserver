'use strict';

module.exports = {
  ...require('./router'),
  ...require('./method_check'),
  ...require('./parse'),

  ...require('./actions'),
};
