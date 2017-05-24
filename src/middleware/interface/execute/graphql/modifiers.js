'use strict';


const { set } = require('../../../../utilities');


// Retrieves an empty modifiers
// Modifiers are sets of interface-specific modifications
// to apply to a response, that are determined at the interface layer
// (not action|command|database layers)
const applyModifiers = function ({ response, modifiers: { noOutput } }) {
  // Remove fields marked with arg.no_output `true`
  if (noOutput) {
    for (const path of noOutput) {
      set({
        obj: response,
        path,
        value(val) {
          // Only override values, do not set new ones
          if (val === undefined) { return val; }
          return val instanceof Array ? [] : {};
        },
      });
    }
  }
  return response;
};


module.exports = {
  applyModifiers,
};
