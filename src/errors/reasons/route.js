// Extra:
//  - value 'PATH'
//  - suggestions VAL_ARR
const ROUTE = {
  status: 'CLIENT_ERROR',
  title: 'The URL or route is invalid',
  getMessage: ({ value }) => `The URL or route '${value}' is invalid`,
}

module.exports = {
  ROUTE,
}
