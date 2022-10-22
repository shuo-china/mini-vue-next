import { h } from '../../lib/mini-vue-next.esm.js'

window.self = null

export const App = {
  setup() {
    return {
      msg: 'zjs'
    }
  },
  render() {
    window.self = this
    return h('div', { id: 'root', class: ['red', 'hard'] }, 'hi,' + this.msg)
  }
}
