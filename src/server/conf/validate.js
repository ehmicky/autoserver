'use strict';

const { extname } = require('path');

const { toSentence } = require('underscore.string');

const { throwError } = require('../../error');

const validateConfFile = function ({ confFile }) {
  const confExtName = extname(confFile);

  if (!ALLOWED_EXTENSIONS.includes(confExtName)) {
    const allowedExtensions = toSentence(ALLOWED_EXTENSIONS, ', ', ' or ');
    const message = `'${confFile}' must have a file extension among: ${allowedExtensions}`;
    throwError(message, { reason: 'CONF_LOADING' });
  }

  return confFile;
};

const ALLOWED_EXTENSIONS = ['.yaml', '.yml', '.json'];

module.exports = {
  validateConfFile,
};
