'use strict';

const { omit, omitBy, reduceAsync } = require('../../../utilities');
const { throwError } = require('../../../error');

const { timestampPlugin } = require('./timestamp');
const { authorPlugin } = require('./author');

// Plugins are functions that take `idl` as input,
// and returns a modified IDL as output
// They can also take an `opts` parameter
// Use cases can be: adding a attribute to each model,
// extending core functionalities, etc.
const applyPlugins = async function ({ idl }) {
  if (!idl.models) { return idl; }

  const plugins = idl.plugins && Array.isArray(idl.plugins)
    ? idl.plugins
    : [];

  // Retrieve all builtinPlugins, except the ones that have been overriden
  const defaultBuiltinPlugins = omitBy(
    builtinPlugins,
    (value, pluginName) => isOverridenPlugin({ plugins, pluginName }),
  );

  // Apply each idl.plugins as FUNC({ idl }) returning idl
  const allPlugins = [...plugins, ...Object.values(defaultBuiltinPlugins)];

  const idlWithPlugins = await reduceAsync(allPlugins, pluginReducer, idl);
  return idlWithPlugins;
};

const isOverridenPlugin = function ({ plugins, pluginName }) {
  return plugins.some(({ plugin }) => plugin === pluginName);
};

const pluginReducer = async function (idl, pluginConf, index) {
  const idlA = await applyPlugin({ idl, index, pluginConf });
  return idlA;
};

const applyPlugin = async function ({ idl, index, pluginConf }) {
  const { plugin, enabled = true, opts = {} } = getPluginConf({ pluginConf });

  // Plugins are only enabled if specified in `idl.plugins`.
  // But builtin plugins, or plugins added by other plugins,
  // need to be manually disabled if desired.
  if (!enabled) { return idl; }

  if (typeof plugin !== 'function') {
    const message = `The plugin at 'plugins[${index}]' is not a function`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  const idlA = await plugin({ idl, opts });
  return idlA;
};

const getPluginConf = function ({ pluginConf, pluginConf: { plugin } }) {
  // Plugin is either a function, or a string (for builtin plugins)
  if (typeof plugin !== 'string') { return pluginConf; }

  const builtinPlugin = builtinPlugins[plugin];

  if (!builtinPlugin) {
    const message = `The plugin '${plugin}' does not exist`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  return { ...builtinPlugin, ...omit(pluginConf, 'plugin') };
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
