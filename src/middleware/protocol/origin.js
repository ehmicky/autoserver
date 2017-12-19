'use strict';

const { throwError } = require('../../errors');
const { getLimits } = require('../../limits');

const { validateProtocolString } = require('./validate_parsing');

// Fill in `mInput.origin`
const parseOrigin = function ({
  protocolAdapter: { getOrigin, getUrl },
  specific,
  config,
}) {
  const origin = getOrigin({ specific });
  validateProtocolString({ origin });

  const url = getUrl({ specific });
  validateUrlLength({ url, config });

  return { origin };
};

const validateUrlLength = function ({ url, config }) {
  const { maxUrlLength } = getLimits({ config });
  if (url.length <= maxUrlLength) { return; }

  const message = `URL length must be less than ${maxUrlLength} characters`;
  throwError(message, { reason: 'URL_LIMIT' });
};

module.exports = {
  parseOrigin,
};
