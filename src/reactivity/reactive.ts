import {
  mutableHandler,
  readonlyHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_is_reactive',
  IS_READONLY = '__v_is_readonly'
}

function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandler)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}
