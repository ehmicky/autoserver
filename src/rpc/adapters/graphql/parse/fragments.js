import { validateDuplicates } from './duplicates.js'

// Retrieve GraphQL fragments
export const getFragments = ({ queryDocument: { definitions } }) => {
  const fragments = definitions.filter(
    ({ kind }) => kind === 'FragmentDefinition',
  )

  // GraphQL spec 5.4.1.1 'Fragment Name Uniqueness'
  validateDuplicates({ nodes: fragments, type: 'fragments' })

  return fragments
}
