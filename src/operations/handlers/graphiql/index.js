'use strict';

module.exports = {
  name: require('./name'),
  routes: require('./routes'),
  methods: require('./methods'),
  ...require('./handler'),
};
