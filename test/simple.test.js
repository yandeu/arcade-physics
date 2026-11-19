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

const object = physics.add.body(5, 0)
object.setVelocityX(5)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
  tick++
}

const getCoordinates = () => {
  return { x: object.x.toFixed(2), y: object.y.toFixed(2) }
}

test('x and y coordinates', () => {
  // alias
  const c = getCoordinates

  assert.strictEqual(c().x, '5.00')
  assert.strictEqual(c().y, '0.00')

  update()
  assert.strictEqual(c().x, '5.08')
  assert.strictEqual(c().y, '0.06')

  update()
  assert.strictEqual(c().x, '5.17')
  assert.strictEqual(c().y, '0.17')

  update()
  assert.strictEqual(c().x, '5.25')
  assert.strictEqual(c().y, '0.33')

  update()
  assert.strictEqual(c().x, '5.33')
  assert.strictEqual(c().y, '0.56')
})
