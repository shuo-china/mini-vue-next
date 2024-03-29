import { NodeTypes } from './ast'
import { TO_DISPLAY_STRING } from './runtimeHelpers'

export function transform(root, options = {}) {
  const context = createTransformContext(root, options)

  traverseNode(root, context)

  createRootCodegen(root)
  root.helpers = [...context.heplers]
}

function createRootCodegen(root) {
  const child = root.children[0]
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode
  } else {
    root.codegenNode = child
  }
}

function traverseNode(node, context) {
  const nodeTransforms = context.nodeTransforms
  const exitFns: any = []

  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    const onExit = transform(node, context)
    if (onExit) {
      exitFns.push(onExit)
    }
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)

    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break

    default:
      break
  }

  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

function traverseChildren(node, context) {
  const children = node.children

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      traverseNode(node, context)
    }
  }
}

function createTransformContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    heplers: new Set(),
    helper(key) {
      context.heplers.add(key)
    }
  }

  return context
}
