'use strict';

const { throwPb } = require('../../../errors');
const { evalFilter } = require('../../../filter');

// Check `model.authorize` `model.*` against `args.newData`
const checkNewData = function ({
  authorize,
  args: { newData },
  clientCollname,
  top,
}) {
  if (newData === undefined) { return; }

  const ids = newData
    .filter(datum => !evalFilter({ filter: authorize, attrs: datum }))
    .map(({ id }) => id);
  if (ids.length === 0) { return; }

  throwPb({
    reason: 'AUTHORIZATION',
    extra: { collection: clientCollname, ids },
    messageInput: { top },
  });
};

module.exports = {
  checkNewData,
};
