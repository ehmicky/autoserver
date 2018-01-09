'use strict';

const { Negotiator } = require('negotiator');
const pluralize = require('pluralize');

const { getWordsList } = require('../../../../utilities');
const { throwError, addErrorHandler } = require('../../../../errors');
const { getByMime, DEFAULT_RAW_FORMAT } = require('../../../../formats');

const { getContentType } = require('./content_type');

// Using `Content-Type` or `Accept` results in `args.format`
// Note that since `args.format` is for both input and output, any of the
// two headers can be used. `Content-Type` has priority.
const getFormatFunc = function ({ specific }) {
  return getContentTypeFormat({ specific }) || getAcceptFormat({ specific });
};

// Using `Content-Type` header
const getContentTypeFormat = function ({ specific }) {
  const { mime } = getContentType({ specific });
  if (mime === undefined) { return; }

  // Request payload won't be parsed. Response payload will use default format.
  const format = eGetByMimeWithDefault({ mime, safe: true });
  return format.name;
};

const defaultToRaw = function () {
  return DEFAULT_RAW_FORMAT;
};

const eGetByMimeWithDefault = addErrorHandler(getByMime, defaultToRaw);

// Using `Accept` header
const getAcceptFormat = function ({ specific: { req } }) {
  const negotiator = new Negotiator(req);
  const mimes = negotiator.mediaTypes();
  if (mimes.length === 0) { return; }

  const formatB = mimes
    .map(mime => eGetByMime({ mime, safe: true }))
    .find(formatA => formatA !== undefined);
  if (formatB !== undefined) { return formatB.name; }

  const formats = getWordsList(mimes, { op: 'and', quotes: true });
  const message = `Unsupported response ${pluralize('format', mimes.length)}: ${formats}`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

// Ignore exceptions due to unexisting mime, since we try several
const eGetByMime = addErrorHandler(getByMime);

module.exports = {
  getFormat: getFormatFunc,
};
