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
  readFile,
  stat,
  readdir,
});

// Like setTimeout(), except uses promises.
// Also, do not keep server alive because of a hanging timeout,
// e.g. used in request timeout or in events errors retries
const pSetTimeout = function (delay, { unref = true } = {}) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise(resolve => {
    const id = setTimeout(resolve, delay);

    if (unref) {
      id.unref();
    }
  });
};

module.exports = {
  ...promise,
  pSetTimeout,
};
