export const getValues = function ({ actions, filter, mapper, ...rest }) {
  return actions
    .filter(({ args }) => filterArgs({ args, filter }))
    .flatMap((action) => mapper({ action, ...rest }))
}

const filterArgs = function ({ args, filter }) {
  return filter.some((key) => args[key] !== undefined)
}
