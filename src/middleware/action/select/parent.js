// When using `select=parent.child`, `select=parent` is implicity added,
// unless it was already selected, including by `select=all` or by specifying
// no `select` at that level
export const addParentSelects = ({ selects }) => {
  const parentSelects = selects.flatMap((select) =>
    getParentSelect({ select, selects }),
  )
  return [...selects, ...parentSelects]
}

const getParentSelect = ({ select, selects }) => {
  const parentSelect = select.replace(PARENT_SELECT_REGEXP, '')

  if (parentSelect === '') {
    return []
  }

  const parentSelectA = parentSelect.split('.')
  const siblingsSelects = getSiblingsSelects({
    selects,
    parentSelect: parentSelectA,
  })

  const doesNotNeedParent =
    siblingsSelects.length === 0 || hasAllParent({ selects: siblingsSelects })

  if (doesNotNeedParent) {
    return []
  }

  return [parentSelectA.join('.')]
}

const getSiblingsSelects = ({ selects, parentSelect }) =>
  selects
    .map((selectA) => selectA.split('.'))
    .filter((selectA) => selectA.length === parentSelect.length)

const hasAllParent = ({ selects }) =>
  selects.some((selectA) => selectA[selectA.length - 1] === 'all')

// Remove last select part, e.g. `parent.child` -> `parent`
const PARENT_SELECT_REGEXP = /\.?[^.]+$/u
