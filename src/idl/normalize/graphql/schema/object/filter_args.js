'use strict';

const filterArgs = function ({
  childDef,
  childDefName,
  inputObjectType,
  action,
  def,
}) {
  // Filter arguments for single actions only include `id`
  return (
    childDefName !== 'id' &&
    inputObjectType === 'filter' &&
    !action.multiple
  // Nested data arguments do not include `id`
  ) || (
    childDefName === 'id' &&
    inputObjectType === 'data' &&
    !def.isTopLevel
  // Readonly fields cannot be specified as data argument
  ) || (
    inputObjectType === 'data' &&
    childDef.readOnly
  // `updateOne|updateMany` do not allow data.id
  ) || (
    action.type === 'update' &&
    childDefName === 'id' &&
    inputObjectType === 'data'
  );
};

module.exports = {
  filterArgs,
};
