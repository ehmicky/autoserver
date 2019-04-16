import { encodingExists } from 'iconv-lite'

// Validate `charset` name is valid
const validateCharset = function({ charset, format }) {
  validateExisting({ charset })
  validateWithFormat({ charset, format })
}

const validateExisting = function({ charset }) {
  if (encodingExists(charset)) {
    return
  }

  throw new Error(`Unsupported charset: '${charset}'`)
}

const validateWithFormat = function({ charset, format, format: { title } }) {
  const isValid = format === undefined || format.hasCharset(charset)

  if (isValid) {
    return
  }

  throw new Error(
    `Unsupported charset with a ${title} content type: '${charset}'`,
  )
}

module.exports = {
  validateCharset,
}
