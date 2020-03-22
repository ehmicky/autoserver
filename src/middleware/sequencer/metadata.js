import { deepMerge } from '../../utils/functional/merge.js'

// Deep merge all results' metadata
export const mergeMetadata = function ({ results, metadata }) {
  const metadataA = results.map((result) => result.metadata)
  const metadataB = deepMerge(metadata, ...metadataA)
  return { metadata: metadataB }
}
