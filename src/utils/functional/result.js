// Like Lodash result(), but faster
export const result = (val, ...args) => {
  if (typeof val !== 'function') {
    return val
  }

  return val(...args)
}
