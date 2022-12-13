// Merge each action `commandpath` into a comma-separated list
export const mergeCommandpaths = ({ actions }) =>
  actions.map(({ commandpath }) => commandpath.join('.')).join(', ')
