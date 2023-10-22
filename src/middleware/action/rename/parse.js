import { throwError } from '../../../errors/main.js'
import { uniq } from '../../../utils/functional/uniq.js'
import { addToActions } from '../add_actions/add.js'

// Parse `args.rename` for each action
export const parseRename = ({ actions, top }) => {
  const actionsA = addToActions({
    actions,
    name: 'rename',
    filter: ['rename'],
    mapper: getRenameArg,
    top,
  })

  return { actions: actionsA }
}

const getRenameArg = ({
  action: {
    args: { rename },
    commandpath,
  },
}) => {
  const renamesA = rename.split(',')
  const renamesB = uniq(renamesA)
  const renamesC = renamesB.map((renameA) =>
    getRenamePart({ rename: renameA, commandpath }),
  )
  return renamesC
}

// Turns `args.rename` 'aaa.bbb.ccc:ddd' into:
// `commandpath` 'aaa.bbb', `key` 'ccc', `outputName` 'ddd']
const getRenamePart = ({ rename, commandpath }) => {
  const renameA = [...commandpath, rename].join('.')
  const [, commandpathA, outputName] = RENAME_REGEXP.exec(renameA) || []

  if (!commandpathA || !outputName) {
    const message = `In 'rename' argument, '${rename}' is invalid`
    throwError(message, { reason: 'VALIDATION' })
  }

  const commandpathB = commandpathA.split('.')
  const commandpathC = commandpathB.slice(0, -1).join('.')
  const key = commandpathB.at(-1)

  return { [commandpathC]: { key, outputName } }
}

const RENAME_REGEXP = /^(.+):([^:]+)$/u
