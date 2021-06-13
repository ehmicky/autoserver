// eslint-disable-next-line import/no-unassigned-import, import/no-unresolved, node/no-missing-import
import '@ehmicky/dev-tasks/register.js'

// eslint-disable-next-line import/no-unresolved, node/no-missing-import
export * from '@ehmicky/dev-tasks'

export { runProd, runDev, runDebug } from './gulp/run.js'
