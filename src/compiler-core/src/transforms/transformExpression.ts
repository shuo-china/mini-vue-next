import { NodeTypes } from '../ast'

export function transformExpression(node) {
  if (node.type === NodeTypes.INTERPOLATION) {
    if (node.content.type === NodeTypes.SIMPLE_EXPRESSION) {
      processSimpleExpression(node.content)
    }
  }
}

function processSimpleExpression(node) {
  node.content = '_ctx.' + node.content
}
