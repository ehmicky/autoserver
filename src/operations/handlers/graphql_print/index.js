'use strict';

module.exports = {
  name: require('./name'),
  methods: require('./methods'),
  routes: require('./routes'),
  ...require('./handler'),
};
