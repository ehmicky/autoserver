'use strict';

const { getModels } = require('./message');

// Extra:
//  - collection `{string}`
//  - ids `{string[]}`: models `id`s
const CONFLICT = {
  status: 'CLIENT_ERROR',
  title: 'Another client updated the same model, resulting in a conflict',
  getMessage: extra => `${getModels(extra)} already ${extra.ids.length === 1 ? 'exist' : 'exists'}`,
};

module.exports = {
  CONFLICT,
};
