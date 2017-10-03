'use strict';

module.exports = {
  name: require('./name'),
  methods: require('./methods'),
  paths: require('./paths'),
  ...require('./handler'),
};
