'use strict';

const mapAttr = function ({ isArray, target, type }) {
  if (!target) {
    return { isArray, type };
  }

  return { isArray, target, type };
};

// Returns a simplified map of all the models in the schema
// Example: {
//   my_model: {
//     my_sub_model: { isArray: true, target: 'another_model', type: 'string' }
//   }
// }
const modelsMap = { mapAttr };

module.exports = {
  modelsMap,
};
