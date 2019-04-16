// Extra:
//  - value STR
//  - suggestions STR_ARR
export const COMMAND = {
  status: 'CLIENT_ERROR',
  title: 'The command name is invalid',
  getMessage: ({ value }) => `Unsupported command '${value}'`,
}
