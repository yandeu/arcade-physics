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

// player (new)
const player = physics.add.body(20, 20, 4, 8)
player.setVelocityX(5)

const platform = physics.add.staticBody(20, 40, 10, 10)

physics.add.collider(player, platform)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
  tick++
}

for (let i = 0; i < 25; i++) {
  update()
}

test('platform and player should collide', () => {
  assert.strictEqual(player.y.toFixed(2), '32.00')
  assert.strictEqual(platform.y.toFixed(2), '40.00')
})
