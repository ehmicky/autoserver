'use strict';

const { omit, omitBy } = require('../../utilities');
const { EngineError } = require('../../error');
const { timestampPlugin } = require('./timestamp');
const { authorPlugin } = require('./author');

// Plugins are functions that take `idl` as input,
// and returns a modified IDL as output
// They can also take an `opts` parameter
// Use cases can be: adding a attribute to each model,
// extending core functionalities, etc.
const applyPlugins = async function ({ idl }) {
  const plugins = idl.plugins && Array.isArray(idl.plugins)
    ? idl.plugins
    : [];

  // Retrieve all builtinPlugins, except the ones that have been overriden
  const defaultBuiltinPlugins = omitBy(builtinPlugins, (value, name) =>
    plugins.some(({ plugin }) => plugin === name)
  );

  // Apply each idl.plugins as FUNC({ idl }) returning idl
  const allPlugins = [...plugins, ...Object.values(defaultBuiltinPlugins)];

  for (const [index, pluginConf] of allPlugins.entries()) {
    // eslint-disable-next-line no-await-in-loop
    idl = await applyPlugin({ idl, index, pluginConf });
  }

  return idl;
};

const applyPlugin = async function ({ idl, index, pluginConf }) {
  const { plugin, enabled = true, opts = {} } = getPluginConf({ pluginConf });

  // Plugins are only enabled if specified in `idl.plugins`.
  // But builtin plugins, or plugins added by other plugins,
  // need to be manually disabled if desired.
  if (!enabled) { return idl; }

  if (typeof plugin !== 'function') {
    const message = `The plugin at 'plugins[${index}]' is not a function`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }

  const newIdl = await plugin({ idl, opts });
  return newIdl;
};

const getPluginConf = function ({ pluginConf, pluginConf: { plugin } }) {
  // Plugin is either a function, or a string (for builtin plugins)
  if (typeof plugin !== 'string') { return pluginConf; }

  const builtinPlugin = builtinPlugins[plugin];

  if (!builtinPlugin) {
    const message = `The plugin '${plugin}' does not exist`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }

  return Object.assign({}, builtinPlugin, omit(pluginConf, 'plugin'));
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
