'use strict';

module.exports = {
  routes: require('./routes'),
  name: require('./name'),
  methods: require('./methods'),
  ...require('./handler'),
  ...require('./response'),
  ...require('./compile'),
  ...require('./startup'),
  payload: require('./payload'),
};
