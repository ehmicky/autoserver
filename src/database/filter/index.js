'use strict';

module.exports = {
  ...require('./parse'),
  ...require('./validate'),
  ...require('./eval'),
  ...require('./authorize'),
};
