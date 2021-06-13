import { promises as fs } from 'fs'

import mustache from 'mustache'

export const renderTemplate = async function ({ template, data }) {
  const htmlFile = await fs.readFile(template, 'utf8')
  const htmlString = mustache.render(htmlFile, data)
  return htmlString
}
