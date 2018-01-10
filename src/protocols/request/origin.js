'use strict';

const { throwError } = require('../../errors');
const { getLimits } = require('../../limits');

const { validateString } = require('./validate');

const parseOrigin = function ({
  protocolAdapter: { getUrl, getOrigin },
  specific,
  config,
}) {
  // Only used to validate URL length
  const url = getUrl({ specific });

  validateString(url, 'url');
  validateUrl({ url, config });

  const origin = getOrigin({ specific });

  validateString(origin, 'origin');

  return { origin };
};

const validateUrl = function ({ url, config }) {
  const { maxUrlLength } = getLimits({ config });
  if (url.length <= maxUrlLength) { return; }

  const message = `URL length must be less than ${maxUrlLength} characters`;
  throwError(message, { reason: 'URL_LIMIT' });
};

module.exports = {
  parseOrigin,
};
