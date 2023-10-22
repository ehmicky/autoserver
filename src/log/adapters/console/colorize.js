import colorsOption from 'colors-option'

const { magenta, green, yellow, red, gray, reset, dim } = colorsOption()

// Colorize a standard error message
// Not performed if terminal does not support colors
export const colorize = ({ log: { event, level }, consoleMessage }) => {
  const [, first, second, , third, fourth = ''] = MESSAGE_REGEXP.test(
    consoleMessage,
  )
    ? MESSAGE_REGEXP.exec(consoleMessage)
    : SHORTMESSAGE_REXEXP.exec(consoleMessage)

  const coloredFourth =
    event === 'failure' ? colorStack({ stack: fourth }) : dim(fourth)

  const colorMessage = [
    colors[level].bold(first),
    colors[level](second),
    third,
    coloredFourth,
  ].join(' ')

  return colorMessage
}

/* jscpd:ignore-start */
// Look for [...] [...] [...] [...] [...] ([...]) ... - ...
const MESSAGE_REGEXP =
  /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\] \[[^\]]*\] (\[[^\]]*\])?) (.*) (- .*)/su
// Look for [...] [...] [...] [...] [...] ([...]) ...
const SHORTMESSAGE_REXEXP =
  /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\] \[[^\]]*\] (\[[^\]]*\])?) (.*)/su
/* jscpd:ignore-end */

// Make it easy to read stack trace with color hints
const colorStack = ({ stack }) =>
  stack
    // Error message is the most visible, other lines (stack trace) are gray
    .replace(/.*/u, (firstLine) => reset.dim(firstLine))
    .replace(
      /(.*\n)(([^ ].*\n)*)/u,
      (full, firstLine, secondLine) => firstLine + reset(secondLine),
    )
    .replaceAll(/ {4,}at.*/gu, (allLines) => gray(allLines))
    // Filepath is a bit more visible, and so is line number
    .replaceAll(
      /(\/[^:]+)(:)(\d+)(:\d+)/gu,
      // eslint-disable-next-line max-params
      (full, path, colon, line, loc) =>
        reset.dim(path) + gray(colon) + gray.bold(line) + gray(loc),
    )
    // Filepath slashes are less visible, so the filenames are easy to pick
    .replaceAll('/', (slash) => gray(slash))

const colors = {
  info: magenta,
  log: green,
  warn: yellow,
  error: red,
}
