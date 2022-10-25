import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots'

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent
  }

  component.emit = emit.bind(null, component) as any

  return component
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

export function setupStatefulComponent(instance) {
  const Component = instance.type

  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    setCurrentInstance(instance)

    // 返回的是fn则为渲染函数，obj则为上下文
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })

    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  // 当前只处理setupResult为obj的情况
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type

  if (Component.render) {
    instance.render = Component.render
  }
}

let currentInstance = null

export function getCurrentInstance() {
  return currentInstance
}

function setCurrentInstance(instance) {
  currentInstance = instance
}
