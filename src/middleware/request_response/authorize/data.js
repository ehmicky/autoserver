'use strict';

const { throwCommonError } = require('../../../error');
const { evalFilter } = require('../../../filter');

// Check `model.authorize` `$model.*` against `args.newData`
const checkNewData = function ({
  authorize,
  args: { newData },
  collname,
  top,
}) {
  if (newData === undefined) { return; }

  const ids = newData
    .filter(datum => !evalFilter({ filter: authorize, attrs: datum }))
    .map(({ id }) => id);
  if (ids.length === 0) { return; }

  throwCommonError({ reason: 'AUTHORIZATION', ids, collname, top });
};

module.exports = {
  checkNewData,
};
