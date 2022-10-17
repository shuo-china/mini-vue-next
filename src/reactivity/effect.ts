class ReactiveEffect {
  private _fn

  constructor(fn) {
    this._fn = fn
  }

  run() {
    this._fn()
  }
}

// 收集依赖
export function track(target, key) {}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
