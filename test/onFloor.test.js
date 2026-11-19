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

const body = physics.add.body(300, 400)
body.setCollideWorldBounds(true)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
  tick++
}

test('check on floor', () => {
  update()
  assert.ok(body.onFloor() === false)
  for (let i = 0; i < 100; i++) {
    update()
  }
  assert.ok(body.onFloor() === true)
})
