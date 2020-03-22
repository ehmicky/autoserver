// Report log by printing it on console
export const report = function ({ log }) {
  const logA = JSON.stringify(log, null, 2)

  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(logA)
}
