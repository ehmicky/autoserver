'use strict';


const { addDefaultAttributes } = require('./default_attributes');


// Plugins are functions that take `idl` as input, and returns a modified IDL as output
// They can also take an `opts` parameter
// Use cases can be: adding a attribute to each model, extending core functionalities, etc.
const applyPlugins = async function ({ idl }) {
  const plugins = !idl.plugins || !(idl.plugins instanceof Array) ? [] : idl.plugins;

  const defaultBuiltinPlugins = Object.entries(builtinPlugins)
    // Not the plugins that are overriden
    .filter(([name]) => !plugins.some(({ plugin }) => plugin === name))
    .map(([, value]) => value);

  // Apply each idl.plugins as FUNC({ idl }) returning idl
  const allPlugins = plugins.concat(defaultBuiltinPlugins);
  for (let pluginConf of allPlugins) {
    if (typeof pluginConf.plugin === 'string') {
      Object.assign(pluginConf, builtinPlugins[plugin]);
    }
    const { plugin, enabled = true, opts = {} } = pluginConf;

    // Plugins are only enabled if specified in `idl.plugins`.
    // But builtin plugins, or plugins added by other plugins, need to be manually disabled if desired.
    if (!enabled) { continue; }

    // Plugin is either a function, or a string (for builtin plugins)
    const pluginFunc = typeof plugin === 'string' ? builtinPlugins[plugin] : plugin;

    idl = await pluginFunc({ idl, opts });
  }

  return idl;
};

const builtinPlugins = {
  timestamps: {
    plugin: addDefaultAttributes,
  },
};


module.exports = {
  applyPlugins,
};
