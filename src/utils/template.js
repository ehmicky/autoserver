import { promises as fs } from 'fs'

import { render } from 'mustache'

export const renderTemplate = async function ({ template, data }) {
  const htmlFile = await fs.readFile(template, 'utf8')
  const htmlString = render(htmlFile, data)
  return htmlString
}
