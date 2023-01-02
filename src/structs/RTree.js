import RBush from 'rbush'

export const rbush = maxEntries => {
  return new RBush(maxEntries)
}

class RTree extends RBush {
  constructor(maxEntries) {
    super(maxEntries)
  }
}

export default RTree
