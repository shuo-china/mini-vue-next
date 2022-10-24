export const enum ShapeFlags {
  // 00001
  ELEMNENT = 1,
  // 00010
  STATEFUL_COMPONENT = 1 << 1,
  // 00100
  TEXT_CHILDREN = 1 << 2,
  // 01000
  ARRAY_CHILDREN = 1 << 3,
  // 10000
  SLOT_CHILDREN = 1 << 4
}
