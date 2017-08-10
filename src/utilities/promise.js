'use strict';

const { promisify } = require('util');
const { stat, readFile, readdir } = require('fs');

const { capitalize } = require('underscore.string');

const { mapValues, mapKeys } = require('./functional');

const promisifyAll = function (obj) {
  const promisedObj = mapValues(obj, func => promisify(func));
  return mapKeys(promisedObj, (func, name) => `p${capitalize(name)}`);
};

const promise = promisifyAll({
  setTimeout,
  readFile,
  stat,
  readdir,
});

module.exports = promise;
