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

const addBody = (x, y, isCircle = false, radius = 0) => {
  const body = physics.add.body(x, y)
  if (isCircle) body.setCircle(radius)
  return body
}

const addStaticBody = (x, y, isCircle = false, radius = 0) => {
  const body = physics.add.staticBody(x, y)
  if (isCircle) body.setCircle(radius)
  return body
}

addBody(100, 100)
addBody(200, 200, true, 50)
addStaticBody(100, 100)
addStaticBody(200, 200, true, 50)

physics.world.update(1 * 1000, 1000 / 60)
physics.world.postUpdate()

test('get overlapRect', () => {
  const bodies = physics.overlapRect(50, 50, 200, 200, true)
  assert.strictEqual(bodies.length, 2)
})

test('get overlapRect incl. static bodies', () => {
  const bodies = physics.overlapRect(50, 50, 200, 200, true, true)
  assert.strictEqual(bodies.length, 4)
})

test('get overlapCirc', () => {
  const bodies = physics.overlapCirc(100, 100, 10)
  assert.strictEqual(bodies.length, 1)
})

test('get overlapCirc', () => {
  const bodies = physics.overlapCirc(100, 100, 10, true, true)
  assert.strictEqual(bodies.length, 2)
})
