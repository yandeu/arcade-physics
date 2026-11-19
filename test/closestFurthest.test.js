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

const makeObject = (x, y) => {
  const object = physics.add.body(x, y)
  object.setBounce(1)
  object.collideWorldBounds = true
  return object
}

makeObject(100, 150).setVelocity(-50, 100)
makeObject(500, 200).setVelocity(-100, -100)
makeObject(300, 400).setVelocity(60, 100)
makeObject(600, 300).setVelocity(-30, -50)

// Loads the spatial tree
physics.world.step(0)

test('get closest and furthest', () => {
  const pointer = { x: 445, y: 312 }
  const closest = physics.closest(pointer)
  const furthest = physics.furthest(pointer)

  if (closest == null || furthest == null) {
    throw 'closest or furthest is null.'
  }

  assert.strictEqual(Math.round(closest.x), 500)
  assert.strictEqual(Math.round(closest.y), 200)
  assert.strictEqual(Math.round(furthest.x), 100)
  assert.strictEqual(Math.round(furthest.y), 150)
})

test('get closest and furthest', () => {
  const tick = 1
  physics.world.update(tick * 1000, 1000 / 60)

  const pointer = { x: 445, y: 312 }
  const closest = physics.closest(pointer)
  const furthest = physics.furthest(pointer)

  if (closest == null || furthest == null) {
    throw 'closest or furthest is null.'
  }

  assert.strictEqual(Math.round(closest.x), 498)
  assert.strictEqual(Math.round(closest.y), 198)
  assert.strictEqual(Math.round(furthest.x), 99)
  assert.strictEqual(Math.round(furthest.y), 152)
})
