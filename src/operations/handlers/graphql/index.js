'use strict';

module.exports = {
  name: require('./name'),
  paths: require('./paths'),
  ...require('./handler'),
  ...require('./response'),
  ...require('./compile'),
  payload: require('./payload'),
};
