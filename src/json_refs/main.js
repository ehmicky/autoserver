import { cwd } from 'node:process'

import { isObjectType } from '../utils/functional/type.js'

import { fireCachedFunc } from './circular_refs.js'
import { findRefs } from './find.js'
import { load } from './load.js'
import { mergeChildren } from './merge.js'
import { getPath } from './path.js'
import { setRef } from './ref_path.js'

// Dereference JSON references, i.e. $ref
// RFC: https://www.ietf.org/archive/id/draft-pbryan-zyp-json-ref-03.txt
// I.e. { $ref: "path" } will be replaced by the target, which must be
// a local path or a Node module ending with `.node`
// Each $ref is relative to the current file.
// Siblings attributes to `$ref` will be deeply merged (with higher priority),
// although this is not standard|spec behavior.
// This function is called recursively, which is why it is passed to children
// Recursion is handled.
export const dereferenceRefs = async ({
  path = '',
  parentPath = cwd(),
  cache = {},
  stack = [],
}) => {
  const pathA = getPath({ path, parentPath })

  const content = await cGetContent({ path: pathA, cache, stack })

  return content
}

const getContent = async ({ path, cache, stack }) => {
  const content = await load({ path })

  const contentA = await dereferenceChildren({ content, path, cache, stack })

  const contentB = setRef({ content: contentA, path })

  return contentB
}

const cGetContent = fireCachedFunc.bind(undefined, getContent)

// Dereference children JSON references
const dereferenceChildren = async ({ content, path, cache, stack }) => {
  // If the `content` is not an object or array, it won't have any children
  if (!isObjectType(content)) {
    return content
  }

  const refs = findRefs({ content })

  const promises = refs.map(({ value, keys }) =>
    dereferenceChild({ path: value, keys, parentPath: path, cache, stack }),
  )
  const children = await Promise.all(promises)

  const contentA = mergeChildren({ content, children })

  return contentA
}

// Resolve child JSON reference to the value it points to
const dereferenceChild = async ({ keys, ...rest }) => {
  const refContent = await dereferenceRefs(rest)
  return { keys, refContent }
}
