'use strict';


const fs = require('fs');
const { promisify } = require('util');

const { mapValues } = require('./functional');


// Make `fs` functions use promises instead of callbacks
const newFs = mapValues(fs, value => {
  return typeof value === 'function' ? promisify(value) : value;
});


module.exports = {
  fs: newFs,
};
