import { throwError } from '../../../../../errors/main.js'

import { applyDirectives } from './directive.js'
import { mergeSelectRename } from './merge_select.js'

// Retrieve `rpcDef.args.select` using GraphQL selection sets
export const parseSelects = ({ args, ...input }) => {
  const selectRename = parseSelectionSet(input)

  const selectA = mergeSelectRename({ selectRename, name: 'select' })
  const renameA = mergeSelectRename({ selectRename, name: 'rename' })

  return { ...args, select: selectA, rename: renameA }
}

const parseSelectionSet = ({
  selectionSet,
  parentPath = [],
  variables,
  fragments,
}) => {
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

const parseSelection = (
  { parentPath, variables, fragments },
  { name: { value: fieldName } = {}, alias, selectionSet, kind },
) =>
  parsers[kind]({
    fieldName,
    alias,
    selectionSet,
    parentPath,
    variables,
    fragments,
  })

const parseField = ({
  fieldName,
  alias,
  selectionSet,
  parentPath,
  variables,
  fragments,
}) => {
  const selectRename = getSelectRename({ parentPath, alias, fieldName })

  const childSelectRename = parseSelectionSet({
    selectionSet,
    parentPath: [...parentPath, fieldName],
    variables,
    fragments,
  })

  return [selectRename, ...childSelectRename]
}

const getSelectRename = ({ parentPath, alias, fieldName }) => {
  const select = [...parentPath, fieldName].join('.')
  const outputName = alias && alias.value

  const rename =
    outputName === undefined || outputName === null
      ? undefined
      : `${select}:${outputName}`

  return { select, rename }
}

const parseFragmentSpread = ({
  parentPath,
  variables,
  fragments,
  fieldName,
}) => {
  const fragment = fragments.find(({ name }) => name.value === fieldName)

  if (fragment === undefined) {
    throwError(`No fragment named ${fieldName}`, { reason: 'VALIDATION' })
  }

  const { selectionSet } = fragment

  return parseSelectionSet({ selectionSet, parentPath, variables, fragments })
}

const parseInlineFragment = ({
  selectionSet,
  parentPath,
  variables,
  fragments,
}) => parseSelectionSet({ selectionSet, parentPath, variables, fragments })

const parsers = {
  Field: parseField,
  FragmentSpread: parseFragmentSpread,
  InlineFragment: parseInlineFragment,
}
