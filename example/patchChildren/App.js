import { h } from '../../lib/mini-vue-next.esm.js'
// import ArrayToText from './ArrayToText.js'
// import TextToText from './TextToText.js'
// import TextToArray from './TextToArray.js'
import ArrayToArray from './ArrayToArray.js'

export const App = {
  name: 'App',
  setup() {},
  render() {
    return h(
      'div',
      {
        tId: 1
      },
      [h('p', {}, '主页'), h(ArrayToArray)]
    )
  }
}
