'use strict';

const mapProp = function ({ multiple, target }) {
  return { multiple, target };
};

// Returns a simplified map of all the models in the IDL
// Example: {
//   my_model: {
//     my_sub_model: { multiple: true, target: 'another_model' }
//   }
// }
const modelsMap = { mapProp };

module.exports = {
  modelsMap,
};
