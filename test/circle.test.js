const { ArcadePhysics } = require('../lib/index.js')

const config = {
  gravity: {
    x: 0,
    y: 200
  },
  width: 800,
  height: 600
}

const physics = new ArcadePhysics(config)

// from example: https://phaser.io/examples/v3/view/physics/arcade/circular-body
const ball1 = physics.add.body(100, 240)
const ball2 = physics.add.body(700, 240)

ball1.setCircle(46)
ball2.setCircle(46)

ball1.setCollideWorldBounds(true)
ball2.setCollideWorldBounds(true)

ball1.setBounce(1)
ball2.setBounce(1)

ball1.setVelocity(150)
ball2.setVelocity(-200, 60)

physics.add.collider(ball1, ball2)

let tick = 0

const update = () => {
  tick++
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate(tick * 1000, 1000 / 60)
}

const getCoordinates = () => {
  return ball1.x.toFixed(0) + ball2.x.toFixed() + ball1.y.toFixed(0) + ball2.y.toFixed()
}

test('x and y coordinates', () => {
  // alias
  const c = getCoordinates

  expect(c()).toBe('100700240240')

  update()
  expect(c()).toBe('103697243241')

  update()
  expect(c()).toBe('105693245242')

  update()
  expect(c()).toBe('108690248243')
})
