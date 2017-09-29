'use strict';

module.exports = {
  name: require('./name'),
  paths: require('./paths'),
  ...require('./handler'),
  payload: require('./payload'),
};
