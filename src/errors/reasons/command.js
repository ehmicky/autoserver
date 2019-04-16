// Extra:
//  - value STR
//  - suggestions STR_ARR
const COMMAND = {
  status: 'CLIENT_ERROR',
  title: 'The command name is invalid',
  getMessage: ({ value }) => `Unsupported command '${value}'`,
}

module.exports = {
  COMMAND,
}
