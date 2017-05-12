'use strict';


const { EngineError } = require('../../error');


const getThrowError = ({ action, modelName }) => function (message, opts) {
  throw new EngineError(`Ìn action '${action}', model '${modelName}', ${message}`, opts);
};


module.exports = {
  getThrowError,
};
