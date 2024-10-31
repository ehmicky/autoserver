import underscoreString from 'underscore.string'

import { COMMANDS } from '../../../../commands/constants.js'
import { mapKeys, mapValues } from '../../../../utils/functional/map.js'

import { getCommandDescription, TOP_DESCRIPTIONS } from './description.js'
import { getCommandName, getTypeName } from './name.js'

// Retrieve the GraphQL definitions for Query|Mutation,
// and the top-level commands
export const getTopDefs = ({ collections }) =>
  mapValues(GRAPHQL_METHODS, (commands, graphqlMethod) =>
    getTopDef({ graphqlMethod, commands, collections }),
  )

// Mapping from GraphQL methods to commands
const GRAPHQL_METHODS = {
  query: ['find'],
  mutation: ['create', 'upsert', 'patch', 'delete'],
}

const getTopDef = ({ collections, graphqlMethod, commands }) => {
  const attributes = getCommandsDefs({ collections, commands })
  const collname = underscoreString.capitalize(graphqlMethod)
  const description = TOP_DESCRIPTIONS[graphqlMethod]

  const topDef = {
    type: 'object',
    attributes,
    collname,
    clientCollname: collname,
    description,
  }
  return topDef
}

// Retrieve attributes for a given GraphQL method
const getCommandsDefs = ({ collections, commands }) => {
  const attributes = COMMANDS.map(({ type }) => type)
    .filter((type) => commands.includes(type))
    .map((command) => getCommandDef({ collections, command }))
  const attributesA = Object.assign({}, ...attributes)
  return attributesA
}

// Retrieve attributes for a given command
const getCommandDef = ({ collections, command }) => {
  const collectionsA = getCollectionsNames({ collections })

  const collectionsB = mapValues(collectionsA, (coll) =>
    normalizeCollDef({ coll, command }),
  )

  // E.g. 'my_coll' + 'findMany' -> 'find_my_coll'
  // This will be used as the top-level graphqlMethod
  const collectionsC = mapKeys(collectionsB, getCommandName)
  return collectionsC
}

// Create one copy of a collection for each of its `clientCollname`
const getCollectionsNames = ({ collections }) => {
  const collectionsA = Object.entries(collections).flatMap(getCollectionNames)
  const collectionsB = Object.assign({}, ...collectionsA)
  return collectionsB
}

const getCollectionNames = ([collname, coll]) =>
  coll.name.map((clientCollname) => ({
    [clientCollname]: { ...coll, clientCollname, collname },
  }))

// Add command information to each top-level collection
const normalizeCollDef = ({ coll, command }) => {
  const typeName = getTypeName({ def: coll })
  const commandDescription = getCommandDescription({ command, typeName })

  return { ...coll, command, commandDescription, type: 'object' }
}
