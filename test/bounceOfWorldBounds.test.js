// @ts-check
import test from 'node:test'
import assert from 'assert'
import { LoadArcadePhysics } from '../dist/index.js'

const config = {
  gravity: {
    x: 0,
    y: 200
  },
  width: 800,
  height: 600
}

// physics
const physics = await LoadArcadePhysics(config)

const ball = physics.add.body(20, 580, 10, 10)

ball.setVelocity(0, 60)
ball.setBounce(1, 1)
ball.setCollideWorldBounds(true)

const pos = []

let tick = 0
const update = () => {
  pos.push(ball.bottom.toFixed(2))
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
  tick++
}

for (let i = 0; i < 25; i++) {
  update()
}

test('ball should bounce of the world bounds', () => {
  assert.strictEqual(pos[0], '590.00')
  assert.strictEqual(pos[8], '600.00')
  assert.strictEqual(pos[17], '590.00')
})
