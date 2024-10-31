import { Negotiator } from 'negotiator'

import { addErrorHandler } from '../../../../errors/handler.js'
import { throwPb } from '../../../../errors/props.js'
import {
  DEFAULT_RAW_FORMAT,
  getByMime,
  getMimes,
} from '../../../../formats/get.js'

import { getContentType } from './content_type.js'

// Using `Content-Type` or `Accept` results in `args.format`
// Note that since `args.format` is for both input and output, any of the
// two headers can be used. `Content-Type` has priority.
export const getFormat = ({ specific }) =>
  getContentTypeFormat({ specific }) || getAcceptFormat({ specific })

// Using `Content-Type` header
const getContentTypeFormat = ({ specific }) => {
  const { mime } = getContentType({ specific })

  if (mime === undefined) {
    return
  }

  // Request payload won't be parsed. Response payload will use default format.
  const format = eGetByMimeWithDefault({ mime, safe: true })
  return format.name
}

const defaultToRaw = () => DEFAULT_RAW_FORMAT

const eGetByMimeWithDefault = addErrorHandler(getByMime, defaultToRaw)

// Using `Accept` header
const getAcceptFormat = ({ specific: { req } }) => {
  const negotiator = new Negotiator(req)
  const mimes = negotiator.mediaTypes()

  if (mimes.length === 0) {
    return
  }

  const formatB = mimes
    .map((mime) => eGetByMime({ mime, safe: true }))
    .find((formatA) => formatA !== undefined)

  if (formatB !== undefined) {
    return formatB.name
  }

  const suggestions = getMimes({ safe: true })
  throwPb({
    reason: 'RESPONSE_NEGOTIATION',
    extra: { kind: 'format', value: mimes, suggestions },
  })
}

// Ignore exceptions due to unexisting mime, since we try several
const eGetByMime = addErrorHandler(getByMime)
