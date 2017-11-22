'use strict';

const mapAttr = function (
  { isArray, target, type },
  { schema: { collections } },
) {
  if (!target) {
    return { isArray, type };
  }

  const [clientTarget] = collections[target].name;

  return { isArray, target, clientTarget, type };
};

// Returns a simplified map of all the collections in the schema
// Example: {
//   my_coll: {
//     my_sub_coll: { isArray: true, target: 'another_coll', type: 'string' }
//   }
// }
const collsMap = { mapAttr };

module.exports = {
  collsMap,
};
