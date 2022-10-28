import { effect } from '../reactivity/effect'
import { EMPTY_OBJ } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppApi } from './createApp'
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(vnode, container) {
    patch(null, vnode, container, null, null)
  }

  // parentComponent: 父级组件实例
  function patch(n1, n2, container, parentComponent, anchor) {
    const { type, shapeFlag } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break

      case Text:
        processText(n1, n2, container)
        break

      default:
        if (shapeFlag & ShapeFlags.ELEMNENT) {
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break
    }
  }

  function processFragment(n1, n2, container, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  function processText(n1, n2, container) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.appendChild(textNode)
  }

  // vnode.children   string(文本) | vnode[]
  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent, anchor)

    pathProps(el, oldProps, newProps)
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlag
    const c1 = n1.children
    const { shapeFlag } = n2
    const c2 = n2.children

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 之前是数组，现在是文本
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children)
        hostSetElementText(container, c2)
      } else {
        // 之前是文本，现在是文本
        if (c1 !== c2) {
          hostSetElementText(container, c2)
        }
      }
    } else {
      // 之前是文本，现在是数组
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // 之前是数组，现在是数组
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1

    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key
    }

    // 处理左侧一样的 i的左侧都是没变的
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }

      i++
    }

    // 处理右侧一样的
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }

      e1--
      e2--
    }

    // 此时旧节点全部处理完毕
    if (i > e1) {
      // 说明i到e2之间的节点应作为新节点传入
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = e2 + 1 < c2.length ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
      // 此时新节点全部处理完毕
    } else if (i > e2) {
      // 说明i到e1之间的节点应该删除
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 此时新旧都存在未处理的节点
      // 中间对比
      let s1 = i
      let s2 = i

      // 新节点要比对的数量
      const toBePatched = e2 - s2 + 1
      let patched = 0

      const newIndexToOldIndexMap = new Array(toBePatched)
      newIndexToOldIndexMap.fill(0)

      // 是否有需要移动的元素
      let moved = false
      let maxNewIndex = 0

      // 新节点的key对应的自身下标
      const keyToNewIndexMap = new Map()
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      // 循环旧节点
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]

        // 新节点已经比对完成，旧节点剩下的都是需要删除的
        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }

        // 该旧节点在新节点中对应的下标
        let newIndex

        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2; j < e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }

        // 该旧节点在新节点中找不到对应的（无法复用）
        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          if (newIndex >= maxNewIndex) {
            maxNewIndex = newIndex
          } else {
            moved = true
          }
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }

      // -----移动元素-----
      // 无需移动的下标数组
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : []
      let j = increasingNewIndexSequence.length - 1

      for (let i = toBePatched - 1; i >= 0; i--) {
        // 该新节点在新的子节点中的下标
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null

        // 新增
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            console.log(nextChild)
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  function pathProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  // element.children   string(文本) | vnode[]
  function mountElement(vnode, container, parentComponent, anchor) {
    const el = (vnode.el = hostCreateElement(vnode.type))

    const { children, props, shapeFlag } = vnode

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor)
    }

    for (const key in props) {
      const val = props[key]

      hostPatchProp(el, key, null, val)
    }

    hostInsert(el, container, anchor)
    // container.appendChild(el)
  }

  // children为数组的情况
  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach(v => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor)
  }

  function mountComponent(initinalVNode, container, parentComponent, anchor) {
    const instance = createComponentInstance(initinalVNode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, initinalVNode, container, anchor)
  }

  function setupRenderEffect(instance, initinalVNode, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance

        const subTree = (instance.subTree = instance.render.call(proxy))

        patch(null, subTree, container, instance, anchor)

        initinalVNode.el = subTree.el

        instance.isMounted = true
      } else {
        const { proxy } = instance

        // 本次组件render后的vnode
        const subTree = instance.render.call(proxy)

        // 上次组件render后的vnode
        const prevSubTree = instance.subTree

        instance.subTree = subTree

        patch(prevSubTree, subTree, container, instance, anchor)
      }
    })
  }

  return {
    createApp: createAppApi(render)
  }
}

// 最长递增子序列算法
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
