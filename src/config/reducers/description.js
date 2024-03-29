import { getWordsList } from '../../utils/string.js'
import { mapAttrs } from '../helpers.js'

// Add related `attr.description`, for the following features:
// `attr.readonly`, `attr.value`, `attr.examples`, `attr.alias`
const mapAttr = ({ attr, attr: { description } }) => {
  const descriptions = allDescriptions.filter(({ test: func }) => func(attr))

  if (descriptions.length === 0) {
    return
  }

  const descriptionA = description ? [description] : []

  const descriptionsA = descriptions.map(({ message }) => message(attr))
  const descriptionB = [...descriptionA, ...descriptionsA].join('\n')

  return { description: descriptionB }
}

const getExamples = ({ examples }) => {
  const examplesA = examples.map((example) => `  - ${example}`).join('\n')
  return `Examples:\n${examplesA}`
}

const getAliasesDescription = ({ alias }) => {
  const aliases = Array.isArray(alias) ? alias : [alias]
  const aliasesA = getWordsList(aliases, { op: 'and', quotes: true })
  return `Aliases: ${aliasesA}.`
}

const allDescriptions = [
  {
    test: ({ readonly }) => readonly === true,
    message: () => 'This attribute is readonly, i.e. cannot be modified.',
  },
  {
    test: ({ value }) => value !== undefined,
    message: () => 'This attribute is transformed or set by the server',
  },
  {
    test: ({ examples }) => examples !== undefined,
    message: getExamples,
  },
  {
    test: ({ alias }) => alias !== undefined,
    message: getAliasesDescription,
  },
  {
    test: ({ aliasOf }) => aliasOf !== undefined,
    message: ({ aliasOf }) => `Alias of '${aliasOf}'.`,
  },
]

export const addDescriptions = mapAttrs.bind(undefined, mapAttr)
