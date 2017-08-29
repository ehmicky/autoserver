'use strict';

const mapAttr = function ({ isArray, target }) {
  if (!target) { return { isArray }; }

  return { isArray, target };
};

// Returns a simplified map of all the models in the IDL
// Example: {
//   my_model: {
//     my_sub_model: { isArray: true, target: 'another_model' }
//   }
// }
const modelsMap = { mapAttr };

module.exports = {
  modelsMap,
};
