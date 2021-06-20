import { nextTick } from 'process'
import { promisify } from 'util'

export default async function testPlugin({
  config,
  opts: { example_option: opt },
}) {
  await promisify(nextTick)()

  return { ...config, $plugin_attr: opt }
}
