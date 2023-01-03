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

const body = physics.add.body(0, 0)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate(tick * 1000, 1000 / 60)
  tick++
}

test('velocity should reset', () => {
  expect(body.velocity.y).toBe(0)
  update()
  expect(body.velocity.y).toBeGreaterThan(0)
  update()
  body.reset()
  expect(body.velocity.y).toBe(0)
  update()
  expect(body.velocity.y).toBeGreaterThan(0)
})
