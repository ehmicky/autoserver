'use strict';

const { extname } = require('path');

const { getWordsList } = require('../../utilities');
const { throwError } = require('../../error');

const validateConfFile = function ({ path, extNames }) {
  if (!path) { return; }

  const confExtName = extname(path);

  const extNamesA = extNames.map(extName => `.${extName}`);

  if (!extNamesA.includes(confExtName)) {
    const allowedExtensions = getWordsList(extNames, { quotes: true });
    const message = `'${path}' must have a file extension among: ${allowedExtensions}`;
    throwError(message, { reason: 'CONF_LOADING' });
  }

  return path;
};

module.exports = {
  validateConfFile,
};
