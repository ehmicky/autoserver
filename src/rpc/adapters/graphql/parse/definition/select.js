import { throwError } from '../../../../../errors/main.js'

import { applyDirectives } from './directive.js'
import { mergeSelectRename } from './merge_select.js'

// Retrieve `rpcDef.args.select` using GraphQL selection sets
export const parseSelects = function ({ args, ...input }) {
  const selectRename = parseSelectionSet(input)

  const selectA = mergeSelectRename({ selectRename, name: 'select' })
  const renameA = mergeSelectRename({ selectRename, name: 'rename' })

  return { ...args, select: selectA, rename: renameA }
}

const parseSelectionSet = function ({
  selectionSet,
  parentPath = [],
  variables,
  fragments,
}) {
  if (selectionSet === undefined || selectionSet === null) {
    return []
  }

  const select = selectionSet.selections
    .filter((selection) => applyDirectives({ selection, variables }))
    .flatMap(
      parseSelection.bind(undefined, { parentPath, variables, fragments }),
    )
  return select
}

const parseSelection = function (
  { parentPath, variables, fragments },
  { name: { value: fieldName } = {}, alias, selectionSet, kind },
) {
  return parsers[kind]({
    fieldName,
    alias,
    selectionSet,
    parentPath,
    variables,
    fragments,
  })
}

const parseField = function ({
  fieldName,
  alias,
  selectionSet,
  parentPath,
  variables,
  fragments,
}) {
  const selectRename = getSelectRename({ parentPath, alias, fieldName })

  const childSelectRename = parseSelectionSet({
    selectionSet,
    parentPath: [...parentPath, fieldName],
    variables,
    fragments,
  })

  return [selectRename, ...childSelectRename]
}

const getSelectRename = function ({ parentPath, alias, fieldName }) {
  const select = [...parentPath, fieldName].join('.')
  const outputName = alias && alias.value

  const rename =
    outputName === undefined || outputName === null
      ? undefined
      : `${select}:${outputName}`

  return { select, rename }
}

const parseFragmentSpread = function ({
  parentPath,
  variables,
  fragments,
  fieldName,
}) {
  const fragment = fragments.find(({ name }) => name.value === fieldName)

  if (fragment === undefined) {
    throwError(`No fragment named ${fieldName}`, { reason: 'VALIDATION' })
  }

  const { selectionSet } = fragment

  return parseSelectionSet({ selectionSet, parentPath, variables, fragments })
}

const parseInlineFragment = function ({
  selectionSet,
  parentPath,
  variables,
  fragments,
}) {
  return parseSelectionSet({ selectionSet, parentPath, variables, fragments })
}

const parsers = {
  Field: parseField,
  FragmentSpread: parseFragmentSpread,
  InlineFragment: parseInlineFragment,
}
