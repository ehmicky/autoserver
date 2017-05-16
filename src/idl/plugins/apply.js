'use strict';


const { EngineStartupError } = require('../../error');
const { timestampPlugin } = require('./timestamp');
const { authorPlugin } = require('./author');


// Plugins are functions that take `idl` as input,
// and returns a modified IDL as output
// They can also take an `opts` parameter
// Use cases can be: adding a attribute to each model,
// extending core functionalities, etc.
const applyPlugins = async function ({ idl }) {
  const plugins = idl.plugins && idl.plugins instanceof Array
    ? idl.plugins
    : [];

  // Retrieve all builtinPlugins, except the ones that have been overriden
  const defaultBuiltinPlugins = Object.entries(builtinPlugins)
    .filter(([name]) => !plugins.some(({ plugin }) => plugin === name))
    .map(([, value]) => value);

  // Apply each idl.plugins as FUNC({ idl }) returning idl
  const allPlugins = plugins.concat(defaultBuiltinPlugins);
  for (let [index, pluginConf] of allPlugins.entries()) {
    // Plugin is either a function, or a string (for builtin plugins)
    if (typeof pluginConf.plugin === 'string') {
      const builtinPlugin = builtinPlugins[pluginConf.plugin];
      if (!builtinPlugin) {
        const message = `The plugin '${pluginConf.plugin}' does not exist`;
        throw new EngineStartupError(message, { reason: 'IDL_VALIDATION' });
      }

      const { plugin } = builtinPlugin;
      pluginConf = Object.assign({}, builtinPlugin, pluginConf, { plugin });
    }

    const { plugin, enabled = true, opts = {} } = pluginConf;

    // Plugins are only enabled if specified in `idl.plugins`.
    // But builtin plugins, or plugins added by other plugins,
    // need to be manually disabled if desired.
    if (!enabled) { continue; }

    if (typeof plugin !== 'function') {
      const message = `The plugin at 'plugins[${index}]' is not a function`;
      throw new EngineStartupError(message, { reason: 'IDL_VALIDATION' });
    }

    idl = await plugin({ idl, opts });
  }

  return idl;
};

const builtinPlugins = {
  timestamp: {
    plugin: timestampPlugin,
  },
  author: {
    plugin: authorPlugin,
  },
};


module.exports = {
  applyPlugins,
};
