import { h, getCurrentInstance } from '../../lib/mini-vue-next.esm.js'

export const Foo = {
  name: 'Foo',
  setup() {
    const instance = getCurrentInstance()
    console.log('Foo:' + instance)
  },
  render() {
    return h('div', {}, 'foo')
  }
}
