'use strict';

const mapAttr = function ({ isArray, target, type }) {
  if (!target) {
    return { isArray, type };
  }

  return { isArray, target, type };
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
