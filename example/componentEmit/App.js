import { h } from '../../lib/mini-vue-next.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  setup() {
    return {}
  },
  render() {
    return h('div', {}, [
      h('div', {}, 'App'),
      h(Foo, {
        onAddFoo(a, b) {
          console.log('on-add', a, b)
        }
      })
    ])
  }
}
