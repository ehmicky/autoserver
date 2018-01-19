'use strict';

const { getModels } = require('./message');

// Extra:
//  - collection `{string}`
//  - ids `{string[]}`: models `id`s
const NOT_FOUND = {
  status: 'CLIENT_ERROR',
  title: 'Some database models could not be found, e.g. the ids were invalid',
  getMessage: extra => `${getModels(extra)} could not be found`,
};

module.exports = {
  NOT_FOUND,
};
