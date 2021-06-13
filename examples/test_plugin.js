import { nextTick } from 'process'
import { promisify } from 'util'

// eslint-disable-next-line import/no-default-export
export default async function testPlugin({
  config,
  opts: { example_option: opt },
}) {
  await promisify(nextTick)()

  return { ...config, $plugin_attr: opt }
}
