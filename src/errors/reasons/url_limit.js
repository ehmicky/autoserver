// Extra:
//  - value NUM
//  - limit NUM
const URL_LIMIT = {
  status: 'CLIENT_ERROR',
  title: 'The URL is too large',
  getMessage: ({ limit, value }) =>
    `URL length must be less than ${limit} characters but has ${value}`,
}

module.exports = {
  URL_LIMIT,
}
