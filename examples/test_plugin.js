import { nextTick } from 'node:process'
import { promisify } from 'node:util'

export default async ({ config, opts: { example_option: opt } }) => {
  await promisify(nextTick)()

  return { ...config, $plugin_attr: opt }
}
