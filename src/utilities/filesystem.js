'use strict';


const fs = require('fs');

const { EngineError } = require('../error');


const readFile = function (path) {
  const promise = new Promise((resolve, reject) => {
    try {
      fs.readFile(path, { encoding: 'utf-8' }, (error, file) => {
        if (error) { reject(createFileError({ path, error })); }
        resolve(file);
      });
    } catch (error) {
      reject(createFileError({ path, error }));
    }
  });
  return promise;
};

const createFileError = function ({ path, error }) {
  return new EngineError(`Could not open file ${path}`, { reason: 'FILE_OPEN_ERROR', innererror: error });
};


module.exports = {
  readFile,
};