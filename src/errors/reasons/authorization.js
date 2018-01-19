'use strict';

const { getModels } = require('./message');

// Extra:
//  - collection `{string}`
//  - ids `{string[]}`: models `id`s
const AUTHORIZATION = {
  status: 'CLIENT_ERROR',
  title: 'The request is not authorized, i.e. not allowed to be performed',
  getMessage: ({ top: { command: { participle } }, ...extra }) =>
    `${getModels(extra)} cannot be ${participle}`,
};

module.exports = {
  AUTHORIZATION,
};
