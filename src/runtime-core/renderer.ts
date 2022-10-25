import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'

export function render(vnode, container) {
  patch(vnode, container, null)
}

function patch(vnode, container, parentComponent) {
  const { type, shapeFlag } = vnode

  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break

    case Text:
      processText(vnode, container)
      break

    default:
      if (shapeFlag & ShapeFlags.ELEMNENT) {
        processElement(vnode, container, parentComponent)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }
      break
  }
}

function processFragment(vnode, container, parentComponent) {
  mountChildren(vnode, container, parentComponent)
}

function processText(vnode, container) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.appendChild(textNode)
}

function processElement(vnode, container, parentComponent) {
  mountElement(vnode, container, parentComponent)
}

// element.children   string(文本) | vnode[]
function mountElement(vnode, container, parentComponent) {
  const el = (vnode.el = document.createElement(vnode.type))

  const { children, props, shapeFlag } = vnode

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
  }

  for (const key in props) {
    const val = props[key]

    const isOn = key => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLocaleLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  container.appendChild(el)
}

// children为数组的情况
function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent)
  })
}

function processComponent(vnode, container, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}

function mountComponent(initinalVNode, container, parentComponent) {
  const instance = createComponentInstance(initinalVNode, parentComponent)

  setupComponent(instance)

  setupRenderEffect(instance, initinalVNode, container)
}

function setupRenderEffect(instance, initinalVNode, container) {
  const { proxy } = instance

  const subTree = instance.render.call(proxy)

  patch(subTree, container, instance)

  initinalVNode.el = subTree.el
}
