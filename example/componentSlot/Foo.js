import { h, renderSlots } from '../../lib/mini-vue-next.esm.js'

export const Foo = {
  name: 'Foo',
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')

    const age = 18

    return h('div', {}, [
      foo,
      renderSlots(this.$slots, 'header', {
        age
      }),
      renderSlots(this.$slots, 'footer')
    ])
  }
}
