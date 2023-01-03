import RBush from 'rbush'

export const rbush = maxEntries => {
  return new RBush(maxEntries)
}

class RTree<T = any> extends RBush<T> {
  constructor(maxEntries) {
    super(maxEntries)
  }
}

export default RTree
