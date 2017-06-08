'use strict';


const fs = require('fs');
const { promisify } = require('util');

// Make `fs` functions use promises instead of callbacks
const newFs = Object.entries(fs)
  .map(([name, value]) => {
    const newValue = typeof value === 'function' ? promisify(value) : value;
    return { [name]: newValue };
  })
  .reduce((memo, obj) => Object.assign(memo, obj), {});

module.exports = {
  fs: newFs,
};
