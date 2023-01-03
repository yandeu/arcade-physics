const { ArcadePhysics } = require('../lib/index.js')

const config = {
  gravity: {
    x: 0,
    y: 200
  },
  width: 800,
  height: 600
}

// physics
const physics = new ArcadePhysics(config)

const ball = physics.add.body(20, 580, 10, 10)

ball.setVelocity(0, 60)
ball.setBounce(1, 1)
ball.setCollideWorldBounds(true)

const pos = []

let tick = 0
const update = () => {
  pos.push(ball.bottom.toFixed(2))
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate(tick * 1000, 1000 / 60)
  tick++
}

for (let i = 0; i < 25; i++) {
  update()
}

test('ball should bounce of the world bounds', () => {
  expect(pos[0]).toBe('590.00')
  expect(pos[8]).toBe('600.00')
  expect(pos[17]).toBe('590.00')
})
