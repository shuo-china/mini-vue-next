import { h } from '../../lib/mini-vue-next.esm.js'

export const Child = {
  name: 'Child',
  setup(props, { emit }) {},
  render(proxy) {
    return h('div', {}, [
      h('div', {}, 'child - props -msg: ' + this.$props.msg)
    ])
  }
}
