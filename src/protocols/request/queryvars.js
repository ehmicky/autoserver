'use strict';

const { getFormat } = require('../../formats');

const { validateString } = require('./validate');

const parseQueryvars = function ({
  protocolAdapter: { getQueryString },
  specific,
}) {
  const queryString = getQueryString({ specific });

  validateString(queryString, 'queryString');

  const queryvars = urlencoded.parseContent(queryString);
  return { queryvars };
};

const urlencoded = getFormat('urlencoded');

module.exports = {
  parseQueryvars,
};
