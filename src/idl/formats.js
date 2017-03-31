'use strict';


const yaml = require('js-yaml');


const parseFile = function (path) {
  const content = yaml.load(path);
  return content;
};


module.exports = {
  parseFile,
};