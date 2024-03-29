import { groupBy } from '../utils/functional/group.js'

// Normalize and group measures, returning an array of objects
export const groupMeasures = ({ measures }) => {
  // Only keep finished measures
  const filteredMeasures = measures.filter(
    ({ duration }) => duration !== undefined,
  )
  // Group measures belonging to the same category and label
  const groupedMeasures = groupBy(filteredMeasures, ['category', 'label'])
  return Object.values(groupedMeasures).map((items) =>
    getGroupMeasure({ measures: items }),
  )
}

// Calculate aggregate for measures belonging to the same category and label
const getGroupMeasure = ({ measures }) => {
  const [{ category, label }] = measures
  const count = measures.length
  const items = measures.map(getMillisecsDuration)
  const duration = items.reduce((sum, time) => sum + time, 0)
  const average = duration / count

  return { category, label, duration, measures: items, count, average }
}

// Use milliseconds, but with nanoseconds precision
const getMillisecsDuration = ({ duration }) => duration / NANOSECS_TO_MILLISECS

const NANOSECS_TO_MILLISECS = 1e6
