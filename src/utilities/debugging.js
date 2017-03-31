'use strict';


const requireFile = function (file) {
  // Make require relative to src/ directory
  const isPath = file.startsWith('/') || file.startsWith('.');
  if (isPath) {
    file = '../../src/' + file;
  }
  return require(file);
};

// So that we can require from dev tools console
const attachRequire = function () {
  global.require = requireFile;
};


module.exports = {
  attachRequire,
};