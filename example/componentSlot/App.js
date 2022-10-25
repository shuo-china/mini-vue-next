import { h, createTextVNode } from '../../lib/mini-vue-next.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  setup() {
    return {}
  },
  render() {
    const app = h('div', {}, 'App')

    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h('p', {}, 'header' + age),
          createTextVNode('hello')
        ],
        footer: () => h('p', {}, 'footer')
      }
    )

    return h('div', {}, [app, foo])
  }
}
