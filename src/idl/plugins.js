'use strict';


// Plugins are functions that take `idl` as input, and returns a modified IDL as output
// They can also take an `opts` parameter
// Use cases can be: adding a attribute to each model, extending core functionalities, etc.
const applyPlugins = async function ({ idl }) {
  const { plugins } = idl;
  if (!plugins || !(plugins instanceof Array)) { return idl; }

  // Apply each idl.plugins as FUNC({ idl }) returning idl
  for (const { plugin, enabled = true, opts = {} } of plugins) {
    // Plugins are only enabled if specified in `idl.plugins`.
    // But builtin plugins, or plugins added by other plugins, need to be manually disabled if desired.
    if (!enabled) { continue; }

    idl = await applyPlugin({ idl, plugin, opts });
  }

  return idl;
};

const applyPlugin = async function ({ idl, plugin, opts }) {
  // Plugin is either a function, or a string (for builtin plugins)
  const pluginFunc = typeof plugin === 'string' ? builtinPlugins[plugin] : plugin;
  return await pluginFunc({ idl, opts });
};

const builtinPlugins = {
};


module.exports = {
  applyPlugins,
};
