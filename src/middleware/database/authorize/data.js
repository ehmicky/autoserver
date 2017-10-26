'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../../../utilities');
const { throwError } = require('../../../error');
const { evalFilter } = require('../../../database');

// Check `model.authorize` `$model.*` against `args.newData`
const checkNewData = function ({ authorize, args: { newData }, modelName }) {
  if (newData === undefined) { return; }

  const ids = newData
    .filter(datum => !evalFilter({ filter: authorize, attrs: datum }))
    .map(({ id }) => id);
  if (ids.length === 0) { return; }

  throwAuthorizationError({ ids, modelName });
};

const throwAuthorizationError = function ({ ids, modelName }) {
  const idsA = getWordsList(ids, { op: 'and', quotes: true });
  const message = `Modifying the '${modelName}' ${pluralize('model', ids.length)} with 'id' ${idsA} is not allowed`;
  throwError(message, { reason: 'AUTHORIZATION' });
};

module.exports = {
  checkNewData,
};
