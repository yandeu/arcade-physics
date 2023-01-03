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

const object = physics.add.body(5, 0)
object.setVelocityX(5)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate(tick * 1000, 1000 / 60)
  tick++
}

const getCoordinates = () => {
  return { x: object.x.toFixed(2), y: object.y.toFixed(2) }
}

test('x and y coordinates', () => {
  // alias
  const c = getCoordinates

  expect(c().x).toBe('5.00')
  expect(c().y).toBe('0.00')

  update()
  expect(c().x).toBe('5.08')
  expect(c().y).toBe('0.06')

  update()
  expect(c().x).toBe('5.17')
  expect(c().y).toBe('0.17')

  update()
  expect(c().x).toBe('5.25')
  expect(c().y).toBe('0.33')

  update()
  expect(c().x).toBe('5.33')
  expect(c().y).toBe('0.56')
})
