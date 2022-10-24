export const enum ShapeFlags {
  // 0001
  ELEMNENT = 1,
  // 0010
  STATEFUL_COMPONENT = 1 << 1,
  // 0100
  TEXT_CHILDREN = 1 << 2,
  // 1000
  ARRAY_CHILDREN = 1 << 3
}
