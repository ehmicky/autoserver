'use strict';

const { throwError } = require('../../error');
const { getLimits } = require('../../limits');

const { validateProtocolString } = require('./validate_parsing');

// Fill in `mInput.origin`
const parseOrigin = function ({
  protocolHandler: { getOrigin, getUrl },
  specific,
}) {
  const origin = getOrigin({ specific });
  validateProtocolString({ origin });

  const url = getUrl({ specific });
  validateUrlLength({ url });

  return { origin };
};

const validateUrlLength = function ({ url, runOpts }) {
  const { maxUrlLength } = getLimits({ runOpts });
  if (url.length <= maxUrlLength) { return; }

  const message = `URL length must be less than ${maxUrlLength} characters`;
  throwError(message, { reason: 'URL_LIMIT' });
};

module.exports = {
  parseOrigin,
};
