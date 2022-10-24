import { h } from '../../lib/mini-vue-next.esm.js'

export const Foo = {
  name: 'Foo',
  setup(props, { emit }) {
    const emitAdd = () => {
      emit('add-foo', 1, 2)
    }

    return {
      emitAdd
    }
  },
  render() {
    const foo = h('p', {}, 'foo')
    const btn = h('button', { onClick: this.emitAdd }, 'emitAdd')
    return h('div', {}, [foo, btn])
  }
}
