import omit from 'omit.js'

import { addGenPbHandler } from '../errors/handler.js'
import { throwError } from '../errors/main.js'
import { reduceAsync } from '../utils/functional/reduce.js'

import { authorPlugin } from './author.js'
import { timestampPlugin } from './timestamp.js'

// Plugins are functions that take `config` as input,
// and returns a modified config as output
// They can also take an `opts` parameter
// Use cases can be: adding a attribute to each collection,
// extending core functionalities, etc.
export const applyPlugins = async ({ config }) => {
  if (!config.collections) {
    return
  }

  const plugins =
    config.plugins && Array.isArray(config.plugins) ? config.plugins : []

  const pluginsA = addDefaultBuiltinPlugins({ plugins })

  const configB = await reduceAsync(
    pluginsA,
    applyPlugin,
    config,
    (configA, newConfig) => ({
      ...configA,
      ...newConfig,
    }),
  )
  return configB
}

// Add builtinPlugins, except the ones that have been overriden
const addDefaultBuiltinPlugins = ({ plugins }) => {
  const pluginNames = new Set(plugins.map(({ plugin }) => plugin))
  const defaultBuiltinPlugins = builtinPlugins.filter(
    ({ name }) => !pluginNames.has(name),
  )

  return [...plugins, ...defaultBuiltinPlugins]
}

// Apply each config.plugins as FUNC({ config }) returning config
const applyPlugin = (config, pluginConf, index) => {
  const { plugin, enabled = true, opts = {} } = getPluginConf({ pluginConf })

  // Plugins are only enabled if specified in `config.plugins`.
  // But builtin plugins, or plugins added by other plugins,
  // need to be manually disabled if desired.
  if (!enabled) {
    return
  }

  if (typeof plugin !== 'function') {
    const message = `The plugin at 'plugins[${index}]' is not a function`
    throwError(message, { reason: 'CONFIG_VALIDATION' })
  }

  const pluginName = getPluginName({ plugin, pluginConf, index })
  return eFirePlugin({ plugin, config, opts, pluginName })
}

// Used if an exception is thrown
const getPluginName = ({ plugin, pluginConf, index }) => {
  if (typeof pluginConf.plugin === 'string') {
    return pluginConf.plugin
  }

  if (plugin.name) {
    return plugin.name
  }

  const pluginName = `plugins[${index}]`
  return pluginName
}

const firePlugin = ({ plugin, config, opts }) => plugin({ config, opts })

const eFirePlugin = addGenPbHandler(firePlugin, {
  reason: 'PLUGIN',
  extra: ({ pluginName }) => ({ plugin: pluginName }),
})

const getPluginConf = ({ pluginConf, pluginConf: { plugin } }) => {
  // Plugin is either a function, or a string (for builtin plugins)
  if (typeof plugin !== 'string') {
    return pluginConf
  }

  const builtinPlugin = builtinPlugins.find(({ name }) => name === plugin)

  if (builtinPlugin === undefined) {
    const message = `The plugin '${plugin}' does not exist`
    throwError(message, { reason: 'CONFIG_VALIDATION' })
  }

  return {
    ...omit.default(builtinPlugin, ['enabled']),
    ...omit.default(pluginConf, ['plugin']),
  }
}

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
]
