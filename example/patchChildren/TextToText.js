import { ref, h } from '../../lib/mini-vue-next.esm.js'

const nextChildren = 'newChildren'
const prevChildren = 'oldChildren'

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange
    }
  },
  render() {
    return this.isChange
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  }
}
