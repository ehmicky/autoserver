import { throwError } from '../errors.js'

import { isObject } from './type.js'

export const checkObject = (obj) => {
  if (isObject(obj)) {
    return
  }

  const message = `Utility must be used with objects: '${obj}'`
  throwError(message)
}
