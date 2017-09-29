'use strict';

module.exports = {
  name: require('./name'),
  paths: require('./paths'),
  methods: require('./methods'),
  ...require('./handler'),
  ...require('./response'),
  ...require('./compile'),
  ...require('./startup'),
  payload: require('./payload'),
};
