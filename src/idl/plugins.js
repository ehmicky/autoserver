'use strict';


// Plugins are functions that take `idl` as input, and returns a modified IDL as output
// Use cases can be: adding a attribute to each model, extending core functionalities, etc.
const applyPlugins = async function ({ idl }) {
  if (!idl.plugins || !(idl.plugins instanceof Array)) { return idl; }

  // Apply each idl.plugins as FUNC({ idl }) returning idl
  return idl.plugins.reduce((idlWithPlugins, plugin) => plugin({ idl: idlWithPlugins }), idl);
};


module.exports = {
  applyPlugins,
};
