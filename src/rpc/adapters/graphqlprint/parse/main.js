import { printSchema } from 'graphql'

import { renderTemplate } from '../../../../utils/template.js'

const TEMPLATE = new URL('print.mustache', import.meta.url)

// Print GraphQL schema as beautified HTML
export const parse = async function ({ config: { graphqlSchema } }) {
  const graphqlPrintedSchema = await printGraphqlSchema({ graphqlSchema })

  const content = await renderTemplate({
    template: TEMPLATE,
    data: { graphqlPrintedSchema, prismVersion: '1.6.0' },
  })

  return { response: { type: 'html', content } }
}

const printGraphqlSchema = function ({ graphqlSchema }) {
  return printSchema(graphqlSchema).trim()
}
