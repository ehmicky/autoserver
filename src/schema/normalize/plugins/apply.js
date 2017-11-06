'use strict';

const { omit, reduceAsync } = require('../../../utilities');
const { throwError } = require('../../../error');

const { timestampPlugin } = require('./timestamp');
const { authorPlugin } = require('./author');

// Plugins are functions that take `schema` as input,
// and returns a modified schema as output
// They can also take an `opts` parameter
// Use cases can be: adding a attribute to each model,
// extending core functionalities, etc.
const applyPlugins = async function ({ schema }) {
  if (!schema.models) { return schema; }

  const plugins = schema.plugins && Array.isArray(schema.plugins)
    ? schema.plugins
    : [];

  const pluginsA = addDefaultBuiltinPlugins({ plugins });

  const schemaA = await reduceAsync(pluginsA, applyPlugin, schema);
  return schemaA;
};

// Add builtinPlugins, except the ones that have been overriden
const addDefaultBuiltinPlugins = function ({ plugins }) {
  const pluginNames = plugins.map(({ plugin }) => plugin);
  const defaultBuiltinPlugins = builtinPlugins
    .filter(({ name }) => !pluginNames.includes(name));

  return [...plugins, ...defaultBuiltinPlugins];
};

// Apply each schema.plugins as FUNC({ schema }) returning schema
const applyPlugin = function (schema, pluginConf, index) {
  const { plugin, enabled = true, opts = {} } = getPluginConf({ pluginConf });

  // Plugins are only enabled if specified in `schema.plugins`.
  // But builtin plugins, or plugins added by other plugins,
  // need to be manually disabled if desired.
  if (!enabled) { return schema; }

  if (typeof plugin !== 'function') {
    const message = `The plugin at 'plugins[${index}]' is not a function`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  return plugin({ schema, opts });
};

const getPluginConf = function ({ pluginConf, pluginConf: { plugin } }) {
  // Plugin is either a function, or a string (for builtin plugins)
  if (typeof plugin !== 'string') { return pluginConf; }

  const builtinPlugin = builtinPlugins.find(({ name }) => name === plugin);

  if (builtinPlugin === undefined) {
    const message = `The plugin '${plugin}' does not exist`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  return { ...omit(builtinPlugin, 'enabled'), ...omit(pluginConf, 'plugin') };
};

const builtinPlugins = [
  {
    name: 'timestamp',
    plugin: timestampPlugin,
    enabled: true,
  },
  {
    name: 'author',
    plugin: authorPlugin,
    enabled: false,
  },
];

module.exports = {
  applyPlugins,
};
