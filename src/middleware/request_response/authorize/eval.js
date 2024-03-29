import { throwPb } from '../../../errors/props.js'
import { mapNodes } from '../../../filter/crawl.js'
import { evalFilter } from '../../../filter/eval.js'

import { handleConfigFuncs } from './functions.js'

// Evaluate `coll.authorize` filter to a boolean
// Do a partial evaluation, because we do not know the value of `model.*` yet
// Returns partial filter if any.
export const evalAuthorize = ({
  collname,
  clientCollname,
  authorize,
  top,
  serverParams,
  config,
  mInput,
}) => {
  const { authorize: authorizeA, params } = handleConfigFuncs({
    collname,
    authorize,
    serverParams,
    config,
    mInput,
  })

  const authorizeB = evalFilter({
    filter: authorizeA,
    attrs: params,
    partialNames: PARTIAL_NAMES_REGEXP,
  })

  checkAuthorize({ clientCollname, authorize: authorizeB, top })

  if (authorizeB === true) {
    return authorizeB
  }

  const authorizeC = mapNodes(authorizeB, removePrefix)
  return authorizeC
}

// Throw error if authorization filter evaluated to false.
const checkAuthorize = ({ clientCollname, authorize, top }) => {
  if (authorize) {
    return
  }

  throwPb({
    reason: 'AUTHORIZATION',
    extra: { collection: clientCollname },
    messageInput: { top },
  })
}

// Remove `model.` prefix in AST's `attrName`
const removePrefix = ({ attrName, ...node }) => {
  if (attrName === undefined) {
    return node
  }

  const attrNameA = attrName.replace(PARTIAL_NAMES_REGEXP, '')
  return { ...node, attrName: attrNameA }
}

// `model.*` is transformed to `authorize`, which is added to
// `args.filter` and checked against `args.data`
const PARTIAL_NAMES_REGEXP = /^model\./u
