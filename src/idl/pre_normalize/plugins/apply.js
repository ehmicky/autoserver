'use strict';

const { omit, reduceAsync } = require('../../../utilities');
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

  const pluginsA = addDefaultBuiltinPlugins({ plugins });

  const idlA = await reduceAsync(pluginsA, applyPlugin, idl);

  const idlB = omit(idlA, 'plugins');
  return idlB;
};

// Add builtinPlugins, except the ones that have been overriden
const addDefaultBuiltinPlugins = function ({ plugins }) {
  const pluginNames = plugins.map(({ plugin }) => plugin);
  const defaultBuiltinPlugins = builtinPlugins
    .filter(({ name }) => !pluginNames.includes(name));

  return [...plugins, ...defaultBuiltinPlugins];
};

// Apply each idl.plugins as FUNC({ idl }) returning idl
const applyPlugin = function (idl, pluginConf, index) {
  const { plugin, enabled = true, opts = {} } = getPluginConf({ pluginConf });

  // Plugins are only enabled if specified in `idl.plugins`.
  // But builtin plugins, or plugins added by other plugins,
  // need to be manually disabled if desired.
  if (!enabled) { return idl; }

  if (typeof plugin !== 'function') {
    const message = `The plugin at 'plugins[${index}]' is not a function`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  return plugin({ idl, opts });
};

const getPluginConf = function ({ pluginConf, pluginConf: { plugin } }) {
  // Plugin is either a function, or a string (for builtin plugins)
  if (typeof plugin !== 'string') { return pluginConf; }

  const builtinPlugin = builtinPlugins.find(({ name }) => name === plugin);

  if (builtinPlugin === undefined) {
    const message = `The plugin '${plugin}' does not exist`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  return { ...builtinPlugin, ...omit(pluginConf, 'plugin') };
};

const builtinPlugins = [
  {
    name: 'timestamp',
    plugin: timestampPlugin,
  },
  {
    name: 'author',
    plugin: authorPlugin,
  },
];

module.exports = {
  applyPlugins,
};
