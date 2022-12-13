// Retrieve format's prefered extension
export const getExtension = ({ extensions: [extension] = [] }) => {
  if (extension === undefined) {
    return
  }

  return `.${extension}`
}
