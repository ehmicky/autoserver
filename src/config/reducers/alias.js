const { omit } = require('../../utils/functional/filter.js')
const { throwPb } = require('../../errors/props.js')
const { mapColls } = require('../helpers')

// Transforms can copy each `alias` as a real attribute,
// and set `aliasOf` property

const mapColl = function({ coll, coll: { attributes }, collname }) {
  if (!attributes) {
    return
  }

  const attributesA = Object.entries(attributes).reduce(
    normalizeAlias.bind(null, { coll, collname }),
    {},
  )

  return { attributes: attributesA }
}

const normalizeAlias = function({ coll, collname }, attrs, [attrName, attr]) {
  const aliases = createAliases({ coll, collname, attrs, attr, attrName })
  return { ...attrs, ...aliases, [attrName]: attr }
}

const createAliases = function({ coll, collname, attrs, attr, attrName }) {
  if (!attr.alias) {
    return {}
  }

  const aliases = Array.isArray(attr.alias) ? attr.alias : [attr.alias]

  const aliasesA = aliases.map(alias =>
    createAlias({ coll, collname, attrs, attr, attrName, alias }),
  )
  const aliasesB = Object.assign({}, ...aliasesA)
  return aliasesB
}

const createAlias = function({ coll, collname, attrs, attr, attrName, alias }) {
  checkAliasDuplicates({ coll, collname, attrs, attrName, alias })

  const aliasAttr = omit(attr, 'alias')
  const attrA = { ...aliasAttr, aliasOf: attrName }

  return { [alias]: attrA }
}

const checkAliasDuplicates = function({
  coll,
  collname,
  attrs,
  attrName,
  alias,
}) {
  const path = `collections.${collname}.attributes.${attrName}.alias`

  if (coll.attributes[alias]) {
    const message = `Cannot have an alias '${alias}' because this attribute already exists`
    throwPb({
      message,
      reason: 'CONFIG_VALIDATION',
      extra: { value: alias, path },
    })
  }

  if (attrs[alias]) {
    const otherAttrName = attrs[alias].aliasOf
    const message = `Attributes '${otherAttrName}' and '${attrName}' cannot have the same alias '${alias}'`
    throwPb({
      message,
      reason: 'CONFIG_VALIDATION',
      extra: { value: alias, path },
    })
  }
}

const normalizeAliases = mapColls.bind(null, mapColl)

module.exports = {
  normalizeAliases,
}
