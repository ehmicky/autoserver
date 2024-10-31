import omit from 'omit.js'

import { throwPb } from '../errors/props.js'
import { fullRecurseMap, recurseMap } from '../utils/functional/map.js'
import { isObject } from '../utils/functional/type.js'
import { transtype } from '../utils/transtype.js'

import { availableInstructions } from './available.js'

// Process options after parsing
export const processOpts = ({ opts }) => {
  // Remove parser-specific values
  const { _: posArgs, ...optsA } = omit.default(opts, parserOpts)

  const { instruction, posArgs: posArgsA } = getInstruction({ posArgs })

  validatePosArgs({ posArgs: posArgsA })

  const optsB = transtypeValues({ opts: optsA })
  const optsC = parseArrays({ opts: optsB })

  return { instruction, opts: optsC }
}

const parserOpts = ['$0', 'help', 'version', 'instruction']

// When using default command, `config` will be the first argument
const getInstruction = ({
  posArgs = [],
  posArgs: [instruction, ...posArgsA] = [],
}) => {
  const validInstruction = availableInstructions.some(
    ({ command }) => command === instruction,
  )

  if (validInstruction) {
    return { instruction, posArgs: posArgsA }
  }

  return { instruction: 'run', posArgs }
}

const validatePosArgs = ({ posArgs }) => {
  if (posArgs.length === 0) {
    return
  }

  const message = `Unknown positional options: '${posArgs.join(' ')}'`
  throwPb({ message, reason: 'CONFIG_VALIDATION', extra: { value: posArgs } })
}

// Allow JSON values for options
const transtypeValues = ({ opts }) => recurseMap(opts, transtype)

// `yargs` parses `--OPT.0` as an object `{ OPT: { 0: ... } }`
// We transform it to an array instead: `{ OPT: [...] }`
const parseArrays = ({ opts }) => fullRecurseMap(opts, parseArray)

const parseArray = (value) => {
  const isArray = isObject(value) && Object.keys(value).some(isIndex)

  if (!isArray) {
    return value
  }

  const arrA = Object.entries(value).filter(([index]) => isIndex(index))

  const indexes = arrA.map(([index]) => index)
  const length = Math.max(...indexes)
  const arrB = Array.from({ length })

  const arrC = arrA.reduce(addArrayValue, arrB)
  return arrC
}

const isIndex = (value) => Number.isInteger(Number(value))

const addArrayValue = (arr, [index, val]) => {
  const indexA = Number(index)
  const start = arr.slice(0, indexA)
  const end = arr.slice(indexA + 1)
  return [...start, val, ...end]
}
