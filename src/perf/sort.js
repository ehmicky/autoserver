import sortOn from 'sort-on'

// Sort by category (asc) then by duration (desc)
export const sortMeasures = (measuresGroups) =>
  sortOn(measuresGroups, [getCategoryIndex, '-average'])

const getCategoryIndex = ({ category }) => CATEGORIES.indexOf(category)

// Order matters, as console printing uses it for sorting
const CATEGORIES = [
  'cli',
  'default',
  'main',
  'config',
  'run_opts',
  'databases',
  'protocols',
  'middleware',
  'time',
  'protocol',
  'protoparse',
  'rpc',
  'action',
  'read',
  'write',
  'request',
  'database',
  'response',
  'final',
]
