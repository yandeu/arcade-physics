const path = require('path')

module.exports = {
  entry: './lib/index.js',
  output: {
    library: 'PHYSICS',
    filename: 'arcade-physics.min.js',
    path: path.resolve(__dirname, 'bundle')
  }
}
