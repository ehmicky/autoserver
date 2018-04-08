'use strict';

module.exports = {
  FILES: require('./files'),
  ...require('./linkcheck'),
  ...require('./format'),
};
