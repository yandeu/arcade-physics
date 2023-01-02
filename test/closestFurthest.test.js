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

const makeObject = (x, y) => {
  const object = physics.add.body(x, y)
  object.bounceX = 1
  object.bounceY = 1
  object.collideWorldBounds = true
  return object
}

makeObject(100, 150).setVelocity(-50, 100)
makeObject(500, 200).setVelocity(-100, -100)
makeObject(300, 400).setVelocity(60, 100)
makeObject(600, 300).setVelocity(-30, -50)

// Loads the spatial tree
physics.world.step(0)

test('get closest and furthest', () => {
  const pointer = { x: 445, y: 312 }
  const closest = physics.closest(pointer)
  const furthest = physics.furthest(pointer)

  expect(Math.round(closest.x)).toBe(500)
  expect(Math.round(closest.y)).toBe(200)
  expect(Math.round(furthest.x)).toBe(100)
  expect(Math.round(furthest.y)).toBe(150)
})

test('get closest and furthest', () => {
  const tick = 1
  physics.world.update(tick * 1000, 1000 / 60)

  const pointer = { x: 445, y: 312 }
  const closest = physics.closest(pointer)
  const furthest = physics.furthest(pointer)

  expect(Math.round(closest.x)).toBe(498)
  expect(Math.round(closest.y)).toBe(198)
  expect(Math.round(furthest.x)).toBe(99)
  expect(Math.round(furthest.y)).toBe(152)
})
