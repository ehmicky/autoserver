'use strict';

const { Buffer } = require('buffer');

const through = require('through2');

// eslint-disable-next-line import/no-internal-modules
const { getFormat, getByExt } = require('../../../src/formats');
const { emitError, validateNotStream } = require('../../utils');

// Convert several file formats towards JSON (or any other format)
const convertFormat = function ({ format = DEFAULT_FORMAT } = {}) {
  const destFormat = getFormat(format);

  return through.obj(function convert (file, encoding, done) {
    // eslint-disable-next-line fp/no-this, no-invalid-this
    return convertFileFormat({ stream: this, file, done, destFormat });
  });
};

const DEFAULT_FORMAT = 'json';

const convertFileFormat = function ({ stream, file, done, destFormat }) {
  const fileA = convertFile({ file, destFormat, stream });

  // eslint-disable-next-line fp/no-mutating-methods
  stream.push(fileA);

  done();
};

const convertFile = function ({ file, destFormat, stream }) {
  if (file.isNull()) { return; }

  validateNotStream({ PLUGIN_NAME, file, stream });
  validateEmpty({ file, stream });

  const fileA = convertContent({ file, destFormat });

  return fileA;
};

const validateEmpty = function ({ file: { contents, path }, stream }) {
  if (contents.length !== 0) { return; }

  const error = `File ${path} is empty. Cannot load empty content`;
  emitError({ PLUGIN_NAME, stream, error });
};

const convertContent = function ({ file, destFormat }) {
  const contents = getContents({ destFormat, file });
  const extname = destFormat.getExtension();

  const fileA = file.clone();
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(fileA, { contents, extname });

  return fileA;
};

const getContents = function ({
  destFormat,
  file: { contents, path },
}) {
  const srcFormat = getByExt({ path });

  const content = contents.toString();

  const contentA = srcFormat.parseContent(content, { path });
  const contentB = destFormat.serializeContent(contentA);

  const contentC = Buffer.from(contentB);
  return contentC;
};

const PLUGIN_NAME = 'gulp-format';

module.exports = {
  convertFormat,
};
