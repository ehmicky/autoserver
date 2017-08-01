'use strict';

const mapProp = function ({ multiple, model }) {
  return { multiple, model };
};

// Returns a simplified map of all the models in the IDL
// Example: {
//   my_model: {
//     my_sub_model: { multiple: true, model: 'another_model' }
//   }
// }
const modelsMap = { mapProp };

module.exports = {
  modelsMap,
};
