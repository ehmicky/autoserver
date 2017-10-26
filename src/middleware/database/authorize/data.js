'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../../../utilities');
const { throwError } = require('../../../error');
const { evalFilter } = require('../../../database');

// Check `model.authorize` `$model.*` against `args.newData`
const checkNewData = function ({
  authorize,
  args: { newData },
  modelName,
  top,
}) {
  if (newData === undefined) { return; }

  const ids = newData
    .filter(datum => !evalFilter({ filter: authorize, attrs: datum }))
    .map(({ id }) => id);
  if (ids.length === 0) { return; }

  throwAuthorizationError({ ids, modelName, top });
};

const throwAuthorizationError = function ({
  ids,
  modelName,
  top: { command: { title } },
}) {
  const idsA = getWordsList(ids, { op: 'and', quotes: true });
  const message = `It is not allowed to ${title} the '${modelName}' ${pluralize('model', ids.length)} with 'id' ${idsA}`;
  throwError(message, { reason: 'AUTHORIZATION' });
};

module.exports = {
  checkNewData,
};
