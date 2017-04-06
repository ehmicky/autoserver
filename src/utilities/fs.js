'use strict';


const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));


module.exports = {
  fs,
};
