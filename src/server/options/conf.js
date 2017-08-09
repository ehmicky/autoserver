'use strict';

const { dirname } = require('path');

const cosmiConfig = require('cosmiconfig');

const { throwError } = require('../../error');

const getConfOptions = async function (oServerOpts) {
  try {
    const cosmiExpl = cosmiConfig('apiengine', {
      rcExtensions: true,
      cache: false,
    });
    const rootDir = dirname(require.main.filename);
    const confResult = await cosmiExpl.load(rootDir);

    const confOpts = confResult ? confResult.config : {};
    return { confOpts, oServerOpts };
  } catch (error) {
    const message = 'Could not load configuration file';
    throwError(message, { reason: 'OPTIONS_VALIDATION', innererror: error });
  }
};

module.exports = {
  getConfOptions,
};
