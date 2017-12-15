'use strict';

const { Negotiator } = require('negotiator');
const pluralize = require('pluralize');

const { getWordsList } = require('../../../../utilities');
const { throwError } = require('../../../../error');
const { findByMime } = require('../../../../formats');

const { getContentType } = require('./content_type');

// Using `Content-Type` or `Accept` results in `args.format`
// Note that since `args.format` is for both input and output, any of the
// two headers can be used. `Content-Type` has priority.
const getFormat = function ({ specific }) {
  return getContentTypeFormat({ specific }) || getAcceptFormat({ specific });
};

// Using `Content-Type` header
const getContentTypeFormat = function ({ specific }) {
  const { mime } = getContentType({ specific });
  if (mime === undefined) { return; }

  // Request payload won't be parsed. Response payload will use default format.
  const format = findByMime({ mime });
  if (format === undefined) { return 'raw'; }

  return format.name;
};

// Using `Accept` header
const getAcceptFormat = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const mimes = negotiator.mediaTypes();
  if (mimes.length === 0) { return; }

  const format = mimes
    .map(mime => findByMime({ mime }))
    .find(formatA => formatA !== undefined);
  if (format !== undefined) { return format.name; }

  const formats = getWordsList(mimes, { op: 'and', quotes: true });
  const message = `Unsupported response ${pluralize('format', mimes.length)}: ${formats}`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

module.exports = {
  getFormat,
};
