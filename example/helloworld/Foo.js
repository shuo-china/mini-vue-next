import { h } from '../../lib/mini-vue-next.esm.js'

export const Foo = {
  setup(props) {
    console.log('props', props)
  },
  render() {
    return h('div', {}, 'foo: ' + this.count)
  }
}
