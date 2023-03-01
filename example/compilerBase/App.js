import { ref } from '../../lib/mini-vue-next.esm.js'

export const App = {
  name: 'App',
  template: '<div>hi, {{ count }}</div>',
  setup() {
    const count = (window.count = ref(1))
    return {
      count
    }
  }
}
