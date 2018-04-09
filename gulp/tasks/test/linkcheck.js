'use strict';

const { dirname } = require('path');
const { promisify } = require('util');

const through = require('through2');
const markdownLinkCheck = require('markdown-link-check');

const { emitError, validateNotStream } = require('../../utils');

const pLinkCheck = promisify(markdownLinkCheck);

// Checks for dead links in Markdown files
const linksCheck = function () {
  return through.obj(linkCheck);
};

// TODO: through2 calls each file serially.
// Checking links in paralle would be much faster.
const linkCheck = async function (file, encoding, done) {
  // eslint-disable-next-line fp/no-this, no-invalid-this, consistent-this
  const stream = this;

  await linkCheckFile({ file, stream });

  // eslint-disable-next-line fp/no-mutating-methods
  stream.push(file);

  done();
};

const linkCheckFile = async function ({
  file,
  file: { contents, path },
  stream,
}) {
  if (file.isNull()) { return; }

  validateNotStream({ PLUGIN_NAME, file, stream });

  const content = contents.toString();

  await linkCheckContent({ path, content, stream });
};

const linkCheckContent = async function ({ path, content, stream }) {
  const brokenLinks = await getBrokenLinks({ path, content });
  if (brokenLinks.length === 0) { return; }

  const error = getErrorMessages({ brokenLinks, path });
  emitError({ PLUGIN_NAME, stream, error });
};

// Parses Markdown, performs HTTP requests against found links and
// reports result
const getBrokenLinks = async function ({ path, content }) {
  const baseUrl = `file://${dirname(path)}`;
  const links = await pLinkCheck(content, { baseUrl });

  const brokenLinks = links.filter(isBrokenLink);
  return brokenLinks;
};

const isBrokenLink = function ({ status }) {
  return status !== 'alive';
};

const getErrorMessages = function ({ brokenLinks, path }) {
  const messages = brokenLinks
    .map(getErrorMessage)
    .join(`\n${MESSAGE_INDENT}`);
  const messagesA = `Some links in '${path}' are wrong:\n${MESSAGE_INDENT}${messages}`;
  return messagesA;
};

// Optimized for Gulp output
const MESSAGE_INDENT_LENGTH = 8;
const MESSAGE_INDENT = ' '.repeat(MESSAGE_INDENT_LENGTH);

const getErrorMessage = function ({ link, err: { message } }) {
  return `'${link}': ${message}`;
};

const PLUGIN_NAME = 'gulp-markdown-link-check';

module.exports = {
  linksCheck,
};
