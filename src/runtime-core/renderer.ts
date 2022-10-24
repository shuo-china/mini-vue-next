import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  const { shapeFlag } = vnode

  if (shapeFlag & ShapeFlags.ELEMNENT) {
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type))

  const { children, props, shapeFlag } = vnode

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.appendChild(el)
}

// children为数组的情况
function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initinalVNode, container) {
  const instance = createComponentInstance(initinalVNode)

  setupComponent(instance)

  setupRenderEffect(instance, initinalVNode, container)
}

function setupRenderEffect(instance, initinalVNode, container) {
  const { proxy } = instance

  const subTree = instance.render.call(proxy)

  patch(subTree, container)

  initinalVNode.el = subTree.el
}
