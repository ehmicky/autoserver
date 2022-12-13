export const getDefaultValue = (def, opts) => {
  const shouldSetDefault = defaultValueTests.every((func) => func(def, opts))

  if (!shouldSetDefault) {
    return
  }

  return def.default
}

const hasDefaultValue = (def) =>
  def.default !== undefined && def.default !== null

// Only for `args.data`
const isDataArgument = (def, { inputObjectType }) => inputObjectType === 'data'

// Only applied when model is created, e.g. on `create` or `upsert`
const isNotPatchData = ({ command }) => DEFAULT_COMMANDS.has(command)

const DEFAULT_COMMANDS = new Set(['create', 'upsert'])

// Config function are skipped
const isStatic = (def) => typeof def.default !== 'function'

const defaultValueTests = [
  hasDefaultValue,
  isDataArgument,
  isNotPatchData,
  isStatic,
]
