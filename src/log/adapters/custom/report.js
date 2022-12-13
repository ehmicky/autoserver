import { runConfigFunc } from '../../../functions/run.js'

// Report log
export const report = ({ opts: { report: configFunc }, configFuncInput }) =>
  runConfigFunc({ configFunc, ...configFuncInput })
