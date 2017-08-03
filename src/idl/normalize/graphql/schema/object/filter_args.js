'use strict';

const filterArgs = function ({
  def,
  defName,
  inputObjectType,
  action,
  parentDef,
}) {
  // Filter arguments for single actions only include `id`
  return (
    defName !== 'id' &&
    inputObjectType === 'filter' &&
    !action.multiple
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
    action.type === 'update' &&
    defName === 'id' &&
    inputObjectType === 'data'
  );
};

module.exports = {
  filterArgs,
};
