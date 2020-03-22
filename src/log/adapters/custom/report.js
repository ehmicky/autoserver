import { runConfigFunc } from '../../../functions/run.js'

// Report log
export const report = function ({
  opts: { report: configFunc },
  configFuncInput,
}) {
  return runConfigFunc({ configFunc, ...configFuncInput })
}
