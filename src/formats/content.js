import { applyCompatParse, applyCompatSerialize } from './compat.js'

// Generic parser, delegating to the format specified in `format`
export const parseContent = async (
  { parse, jsonCompat },
  content,
  { path, compat = true } = {},
) => {
  const contentA = await parse({ content, path })

  if (!compat) {
    return contentA
  }

  const contentB = applyCompatParse({ jsonCompat, content: contentA })
  return contentB
}

// Generic serializer, delegating to the format specified in `format`
export const serializeContent = async ({ serialize, jsonCompat }, content) => {
  const contentA = applyCompatSerialize({ jsonCompat, content })
  const contentB = await serialize({ content: contentA })
  return contentB
}
