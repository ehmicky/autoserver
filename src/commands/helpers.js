// Merge each action `commandpath` into a comma-separated list
export const mergeCommandpaths = function({ actions }) {
  return actions.map(({ commandpath }) => commandpath.join('.')).join(', ')
}
