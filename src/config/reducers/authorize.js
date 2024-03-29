import { getAuthorizeAttrs } from '../../filter/authorize.js'
import { parseFilter } from '../../filter/parse/main.js'
import { validateFilter } from '../../filter/validate/main.js'
import { mapColls } from '../helpers.js'

// Parse `config.authorize` and `coll.authorize` into AST
export const normalizeAuthorize = ({ config, config: { authorize } }) => {
  if (authorize === undefined) {
    return
  }

  const prefix = "In 'config.authorize', "
  const authorizeA = parseAuthorize({ authorize, config, prefix })

  const configA = mapColls(mapColl, { config })

  return { ...configA, authorize: authorizeA }
}

const mapColl = ({ coll: { authorize }, collname, config }) => {
  if (authorize === undefined) {
    return
  }

  const prefix = `In 'collection.${collname}.authorize', `
  const authorizeA = parseAuthorize({ authorize, collname, config, prefix })

  return { authorize: authorizeA }
}

const parseAuthorize = ({ authorize, collname, config, prefix }) => {
  const reason = 'CONFIG_VALIDATION'
  const authorizeA = parseFilter({ filter: authorize, prefix, reason })

  const attrs = getAuthorizeAttrs({ config, collname })
  validateFilter({
    filter: authorizeA,
    prefix,
    reason,
    attrs,
    skipConfigFuncs: true,
  })

  return authorizeA
}
