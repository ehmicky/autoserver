'use strict';

const { promisify } = require('util');
const { realpath, readFile } = require('fs');

const { capitalize } = require('underscore.string');

const { mapValues, mapKeys } = require('./functional');

const promisifyAll = function (obj) {
  const promisedObj = mapValues(obj, func => promisify(func));
  return mapKeys(promisedObj, (func, name) => `p${capitalize(name)}`);
};

const promise = promisifyAll({
  setTimeout,
  realpath,
  readFile,
});

module.exports = promise;
