'use strict';

const { Buffer } = require('buffer');

const through = require('through2');
const { PluginError, replaceExtension } = require('gulp-util');

// eslint-disable-next-line import/no-internal-modules
const { getFormat, getByExt } = require('../src/formats');

// Convert several file formats towards JSON (or any other format)
const convertFormat = function ({ format = 'json' } = {}) {
  const destFormat = getFormat(format);

  return through.obj(function convert (file, encoding, done) {
    // eslint-disable-next-line no-invalid-this, fp/no-this
    return convertFile({ file, destFormat, gulp: this, done });
  });
};

const convertFile = function ({ file, destFormat, gulp, done }) {
  validateInput({ gulp, file });

  convertContent({ file, destFormat });

  // eslint-disable-next-line fp/no-mutating-methods
  gulp.push(file);

  done();
};

const validateInput = function ({ gulp, file }) {
  validateBuffer({ gulp, file });
  validateEmpty({ gulp, file });
};

const validateBuffer = function ({ gulp, file }) {
  if (file.isBuffer()) { return; }

  const error = 'Streams are not supported';
  emitError({ gulp, error });
};

const validateEmpty = function ({ gulp, file: { contents, path } }) {
  if (contents.length !== 0) { return; }

  const error = `File ${path} is empty. Cannot load empty content`;
  emitError({ gulp, error });
};

const emitError = function ({ gulp, error }) {
  const errorA = new PluginError(PLUGIN_NAME, error, { showStack: true });
  gulp.emit('error', errorA);
};

const PLUGIN_NAME = 'gulp-format';

const convertContent = function ({ file, file: { path }, destFormat }) {
  const srcFormat = getByExt({ path });

  const contents = getContents({ srcFormat, destFormat, file });
  const pathA = getPath({ destFormat, path });

  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(file, { contents, path: pathA });
};

const getContents = function ({
  srcFormat,
  destFormat,
  file: { contents, path },
}) {
  const content = contents.toString();
  const contentA = srcFormat.parseContent(content, { path });
  const contentB = destFormat.serializeContent(contentA);
  const contentC = Buffer.from(contentB);
  return contentC;
};

const getPath = function ({ destFormat, path }) {
  const extension = destFormat.getExtension();
  const pathA = replaceExtension(path, extension);
  return pathA;
};

module.exports = {
  convertFormat,
};
