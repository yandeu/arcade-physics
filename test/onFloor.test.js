const { experiments } = require('webpack')
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

const body = physics.add.body(300, 400)
body.setCollideWorldBounds(true)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate(tick * 1000, 1000 / 60)
  tick++
}

test('check on floor', () => {
  update()
  expect(body.onFloor()).toBeFalsy()
  for (let i = 0; i < 100; i++) {
    update()
  }
  expect(body.onFloor()).toBeTruthy()
})
