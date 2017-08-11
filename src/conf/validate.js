'use strict';

const { extname } = require('path');

const { toSentence } = require('underscore.string');

const { throwError } = require('../error');

const validateConfFile = function ({ path }) {
  if (!path) { return; }

  const confExtName = extname(path);

  if (!ALLOWED_EXTENSIONS.includes(confExtName)) {
    const allowedExtensions = toSentence(ALLOWED_EXTENSIONS, ', ', ' or ');
    const message = `'${path}' must have a file extension among: ${allowedExtensions}`;
    throwError(message, { reason: 'CONF_LOADING' });
  }

  return path;
};

const ALLOWED_EXTENSIONS = ['.yaml', '.yml', '.json'];

module.exports = {
  validateConfFile,
};
