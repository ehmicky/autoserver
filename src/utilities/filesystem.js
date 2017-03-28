'use strict';


const fs = require('fs');

const { EngineError } = require('../error');
const { getPromise } = require('./promise');


const readFile = async function (path) {
  const promise = getPromise();
  try {
    fs.readFile(path, { encoding: 'utf-8' }, (error, file) => {
      if (error) {
        throw createFileError({ path, error });
      }
      promise.resolve(file);
    });
    return await promise;
  } catch (error) {
    throw createFileError({ path, error });
  }
};

const createFileError = function ({ path, error }) {
  return new EngineError(`Could not open file ${path}`, { reason: 'FILE_OPEN_ERROR', innererror: error });
};


module.exports = {
  readFile,
};