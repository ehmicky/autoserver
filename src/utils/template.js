import { readFile } from 'node:fs/promises'

import mustache from 'mustache'

export const renderTemplate = async function ({ template, data }) {
  const htmlFile = await readFile(template, 'utf8')
  const htmlString = mustache.render(htmlFile, data)
  return htmlString
}
