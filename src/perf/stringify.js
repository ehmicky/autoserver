import { sortMeasures } from './sort.js'

// Returns measures but as a single string, for console debugging
export const stringifyMeasures = ({ phase = '', measuresGroups }) => {
  const sortedMeasures = sortMeasures(measuresGroups)
  return sortedMeasures.map(stringifyMeasure.bind(undefined, phase)).join('\n')
}

// Prints as a table
const stringifyMeasure = (
  phase,
  { category, label, average, count, duration },
) => {
  const phaseS = phase.padEnd(LENGTHS.phase)
  const categoryS = category.padEnd(LENGTHS.category)
  const labelS = label.padEnd(LENGTHS.label)
  const durationS = formatDuration(duration).padStart(LENGTHS.duration)
  const averageS = formatDuration(average).padStart(LENGTHS.average)
  const items = count === 1 ? 'item' : 'items'
  const countS = `${String(count).padStart(LENGTHS.count)} ${items}`

  return `${phaseS} ${categoryS} ${labelS} ${durationS} = ${averageS} * ${countS}`
}

const formatDuration = (duration) => {
  const durationA = Math.round(duration * DECIMALS_EXP) / DECIMALS_EXP

  const durationB = String(durationA)
  const [, integer, decimals] = DECIMALS_REGEXP.exec(durationB)
  const decimalsA = decimals.padEnd(DECIMALS_COUNT).replace(/ /gu, '0')

  const durationC = `${integer}.${decimalsA}ms`
  return durationC
}

// '1.2345' -> '1', '2345'
const DECIMALS_REGEXP = /(\d*)\.?(\d*)/u

const DECIMALS_COUNT = 2
const DECIMALS_EXP = 1e2

// How wide each column is
const LENGTHS = {
  phase: 8,
  category: 10,
  label: 26,
  duration: 11,
  average: 10,
  count: 3,
}
