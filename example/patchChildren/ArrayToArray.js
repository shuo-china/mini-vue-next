import { ref, h } from '../../lib/mini-vue-next.esm.js'

// 左侧
// (ab)c
// (ab)de
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]
// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'E' }, 'E')
// ]

// 右侧
// a(bc)
// ae(bc)
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]
// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'E' }, 'E'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]

// 新的比旧的长（新增）
// (ab)
// (ab)c
// const prevChildren = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B')]
// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]

// (ab)
// c(ab)
// const prevChildren = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B')]
// const nextChildren = [
//   h('p', { key: 'C' }, 'C'),
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B')
// ]

// 旧的比新的长（删除）
// (ab)c
// (ab)
// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]
// const nextChildren = [h('p', { key: 'A' }, 'A'), h('p', { key: 'B' }, 'B')]

// const prevChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C')
// ]
// const nextChildren = [h('p', { key: 'B' }, 'B'), h('p', { key: 'C' }, 'C')]

// 对比中间部分
const prevChildren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'C', id: 'c-prev' }, 'C'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'E' }, 'E'),
  h('p', { key: 'Z' }, 'Z'),
  h('p', { key: 'F' }, 'F'),
  h('p', { key: 'G' }, 'G')
]
const nextChildren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'C', id: 'c-next' }, 'C'),
  h('p', { key: 'Y' }, 'Y'),
  h('p', { key: 'E' }, 'E'),
  h('p', { key: 'F' }, 'F'),
  h('p', { key: 'G' }, 'G')
]

export default {
  name: 'ArrayToArray',
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
