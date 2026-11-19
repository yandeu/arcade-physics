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

const body = physics.add.body(0, 0, 64, 64)
const staticBody = physics.add.staticBody(0, 0, 64, 64)

test('hitTest', () => {
  assert.ok(body.hitTest(20, 20) == true)
  assert.ok(body.hitTest(80, 20) === false)

  assert.ok(staticBody.hitTest(20, 20) === true)
  assert.ok(staticBody.hitTest(80, 20) === false)
})
