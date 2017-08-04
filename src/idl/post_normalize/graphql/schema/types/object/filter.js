'use strict';

const { omitBy } = require('../../../../../../utilities');

const filterFields = function ({ fields, parentDef, opts }) {
  return omitBy(fields, (def, defName) =>
    filterField({ parentDef, def, defName, opts })
  );
};

const filterField = function ({
  parentDef,
  def,
  defName,
  opts: { inputObjectType },
}) {
  // Filter arguments for single actions only include `id`
  return (
    defName !== 'id' &&
    inputObjectType === 'filter' &&
    !parentDef.action.multiple
  // Nested data arguments do not include `id`
  ) || (
    defName === 'id' &&
    inputObjectType === 'data' &&
    parentDef.kind === 'attribute'
  // Readonly fields cannot be specified as data argument
  ) || (
    inputObjectType === 'data' &&
    def.readOnly
  // `updateOne|updateMany` do not allow data.id
  ) || (
    defName === 'id' &&
    inputObjectType === 'data' &&
    parentDef.action.type === 'update'
  );
};

module.exports = {
  filterFields,
};
