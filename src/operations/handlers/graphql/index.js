'use strict';

module.exports = {
  paths: require('./paths'),
  name: require('./name'),
  methods: require('./methods'),
  ...require('./handler'),
  ...require('./response'),
  ...require('./compile'),
  ...require('./startup'),
  payload: require('./payload'),
};
