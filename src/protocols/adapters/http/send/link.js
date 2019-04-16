import { stringify as stringifyLinks } from 'li'

import { omitBy } from '../../../../utils/functional/filter.js'
import { mapValues } from '../../../../utils/functional/map.js'
import { stringifyUrl, getStandardUrl } from '../origin.js'

// `Link` HTTP header, using pagination metadata,
// with `rel` `first|last|next|prev`
const getLinks = function({ pages = {}, specific, rpc }) {
  // Only with REST
  if (rpc !== 'rest') {
    return
  }

  const url = getStandardUrl({ specific })

  const links = mapValues(LINKS_NAMES, ({ name, cursorName }) =>
    getLinkUrl({ pages, name, cursorName, url }),
  )
  const linksA = omitBy(links, link => link === undefined)

  if (Object.keys(linksA).length === 0) {
    return
  }

  const linksB = stringifyLinks(linksA)
  return linksB
}

const LINKS_NAMES = {
  next: { name: 'next_token', cursorName: 'after' },
  first: { name: 'first_token', cursorName: 'after' },
  prev: { name: 'prev_token', cursorName: 'before' },
  last: { name: 'last_token', cursorName: 'before' },
}

const getLinkUrl = function({ pages, name, cursorName, url }) {
  const token = pages[name]

  if (token === undefined) {
    return
  }

  CURSOR_NAMES.forEach(cursorNameA => url.searchParams.delete(cursorNameA))

  url.searchParams.set(cursorName, token)

  const link = stringifyUrl({ url })
  return link
}

const CURSOR_NAMES = ['before', 'after']

module.exports = {
  getLinks,
}
