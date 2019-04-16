import { promisify } from 'util'
import { stat, readdir, readFile, writeFile } from 'fs'

// TODO: replace with `fs.promises` after dropping support for Node 10
export const pStat = promisify(stat)
export const pReaddir = promisify(readdir)
export const pReadFile = promisify(readFile)
export const pWriteFile = promisify(writeFile)
