import { parseContentType } from '../../../../formats/content_type.js'

// Parse HTTP header `Content-Type`
export const getContentType = function ({
  specific: {
    req: { headers },
  },
}) {
  const contentType = headers['content-type']
  return parseContentType({ contentType })
}
