import { promises } from 'fs'

import { render } from 'mustache'

export const renderTemplate = async function({ template, data }) {
  const htmlFile = await promises.readFile(template, 'utf8')
  const htmlString = render(htmlFile, data)
  return htmlString
}
