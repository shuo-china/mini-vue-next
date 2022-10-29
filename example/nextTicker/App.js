import {
  h,
  ref,
  getCurrentInstance,
  nextTick
} from '../../lib/mini-vue-next.esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()

    const onClick = () => {
      for (let i = 0; i < 100; i++) {
        count.value = i
      }

      nextTick(() => {
        console.log(instance.vnode.el.innerText)
      })
    }

    return {
      count,
      onClick
    }
  },
  render() {
    const button = h('button', { onClick: this.onClick }, 'update')
    const p = h('p', {}, 'count: ' + this.count)
    return h('div', {}, [button, p])
  }
}
