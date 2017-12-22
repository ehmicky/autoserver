'use strict';

const { Buffer } = require('buffer');

const through = require('through2');
const { PluginError, replaceExtension } = require('gulp-util');

const {
  formatAdapters,
  findByExt,
  parse,
  serialize,
// eslint-disable-next-line import/no-internal-modules
} = require('../src/formats');

// Convert several file formats towards JSON (or any other format)
const convertFormat = function ({ format = 'json' } = {}) {
  validateFormat({ format });
  const destFormat = formatAdapters[format];

  return through.obj(function convert (file, encoding, done) {
    // eslint-disable-next-line no-invalid-this, fp/no-this
    return convertFile({ file, destFormat, gulp: this, done });
  });
};

const validateFormat = function ({ format }) {
  if (formatAdapters[format] !== undefined) { return; }

  const error = `Format '${format}' does not exit`;
  // eslint-disable-next-line fp/no-throw
  throw error;
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
  const srcFormat = findByExt({ path });

  const contents = getContents({ srcFormat, destFormat, file });
  const pathA = getPath({ destFormat, path });

  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(file, { contents, path: pathA });
};

const getPath = function ({ destFormat, path }) {
  const extName = getExtName({ destFormat });
  const pathA = replaceExtension(path, extName);
  return pathA;
};

const getExtName = function ({ destFormat: { extNames: [extName] } }) {
  if (extName === undefined) { return ''; }

  return `.${extName}`;
};

const getContents = function ({
  srcFormat,
  destFormat,
  file: { contents, path },
}) {
  const content = contents.toString();
  const contentA = parse({ content, format: srcFormat.name, path });
  const contentB = serialize({ content: contentA, format: destFormat.name });
  const contentC = Buffer.from(contentB);
  return contentC;
};

module.exports = {
  convertFormat,
};
