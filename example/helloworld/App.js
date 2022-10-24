import { h } from '../../lib/mini-vue-next.esm.js'
import { Foo } from './Foo.js'

window.self = null

export const App = {
  name: 'App',
  setup() {
    return {
      msg: 'zjs'
    }
  },
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick() {
          console.log('click')
        }
      },
      [
        h('div', {}, 'hi,' + this.msg),
        h(Foo, {
          count: 1
        })
      ]
    )
  }
}
