// Report log by printing it on console
export const report = ({ log }) => {
  const logA = JSON.stringify(log, undefined, 2)

  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(logA)
}
