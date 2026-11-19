// @ts-check
import test from 'node:test'
import assert from 'assert'
import { LoadArcadePhysics } from '../dist/index.js'

const config = {
  gravity: {
    x: 0,
    y: 0
  },
  width: 800,
  height: 600
}

const physics = await LoadArcadePhysics(config)
const rect = physics.add.body(100, 100)

let tick = 0

const update = () => {
  // needed to use physics.moveTo()
  const fakeGameObject = { body: rect, x: rect.x, y: rect.y }
  // move rect from 100x100 to 200x200 in 1000ms
  if (tick === 0) physics.moveTo(fakeGameObject, 200, 200, 0, 1000)

  tick++
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
}

const getPosition = () => {
  return { x: rect.x.toFixed(0), y: rect.y.toFixed(0) }
}

test('x and y positions', () => {
  let pos = getPosition()
  assert.strictEqual(pos.y, '100')
  assert.strictEqual(pos.x, '100')

  // simulate 1 second
  for (let i = 0; i < 60; i++) update()

  pos = getPosition()
  assert.strictEqual(pos.y, '200')
  assert.strictEqual(pos.x, '200')
})
