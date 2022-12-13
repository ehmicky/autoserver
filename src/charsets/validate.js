import iconvLite from 'iconv-lite'

// Validate `charset` name is valid
export const validateCharset = ({ charset, format }) => {
  validateExisting({ charset })
  validateWithFormat({ charset, format })
}

const validateExisting = ({ charset }) => {
  if (iconvLite.encodingExists(charset)) {
    return
  }

  throw new Error(`Unsupported charset: '${charset}'`)
}

const validateWithFormat = ({ charset, format, format: { title } }) => {
  const isValid = format === undefined || format.hasCharset(charset)

  if (isValid) {
    return
  }

  throw new Error(
    `Unsupported charset with a ${title} content type: '${charset}'`,
  )
}
