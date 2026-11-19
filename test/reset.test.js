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

const physics = await LoadArcadePhysics(config)

const body = physics.add.body(0, 0)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
  tick++
}

test('velocity should reset', () => {
  assert.strictEqual(body.velocity.y, 0)
  update()
  assert.ok(body.velocity.y > 0)
  update()
  body.reset(0, 0)
  assert.strictEqual(body.velocity.y, 0)
  update()
  assert.ok(body.velocity.y > 0)
})
