import { throwError } from '../../../errors/main.js'
import { uniq } from '../../../utils/functional/uniq.js'
import { addToActions } from '../add_actions/add.js'

import { addParentSelects } from './parent.js'

// Parse `args.select` for each action
export const parseSelect = ({ actions, top }) => {
  const actionsA = addToActions({
    actions,
    name: 'select',
    filter: ['select'],
    mapper: getSelectArg,
    top,
  })

  return { actions: actionsA }
}

const getSelectArg = ({
  action: {
    args: { select },
    commandpath,
  },
}) => {
  const selects = select.split(',')
  const selectsA = uniq(selects)
  const selectsB = addParentSelects({ selects: selectsA })
  const selectsC = selectsB.map((selectA) =>
    getSelectPart({ select: selectA, commandpath }),
  )
  const selectsD = uniq(selectsC)
  return selectsD
}

// Turns `args.select` 'aaa.bbb.ccc' into: { 'aaa.bbb': 'ccc' }
const getSelectPart = ({ select, commandpath }) => {
  const parts = select.split('.')
  const key = parts[parts.length - 1]
  const commandpathA = parts.slice(0, -1)
  const commandpathB = [...commandpath, ...commandpathA].join('.')

  if (key) {
    return { [commandpathB]: key }
  }

  const message = `In 'select' argument, '${select}' is invalid`
  throwError(message, { reason: 'VALIDATION' })
}
