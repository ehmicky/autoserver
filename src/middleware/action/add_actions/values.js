export const getValues = ({ actions, filter, mapper, ...rest }) =>
  actions
    .filter(({ args }) => filterArgs({ args, filter }))
    .flatMap((action) => mapper({ action, ...rest }))

const filterArgs = ({ args, filter }) =>
  filter.some((key) => args[key] !== undefined)
