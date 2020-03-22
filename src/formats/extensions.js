// Retrieve format's prefered extension
export const getExtension = function ({ extensions: [extension] = [] }) {
  if (extension === undefined) {
    return
  }

  return `.${extension}`
}
