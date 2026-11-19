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

// from example: https://phaser.io/examples/v3/view/physics/arcade/circular-body
const ball1 = physics.add.body(100, 240)
const ball2 = physics.add.body(700, 240)

ball1.setCircle(46)
ball2.setCircle(46)

ball1.setCollideWorldBounds(true)
ball2.setCollideWorldBounds(true)

ball1.setBounce(1)
ball2.setBounce(1)

ball1.setVelocity(150)
ball2.setVelocity(-200, 60)

physics.add.collider(ball1, ball2)

let tick = 0

const update = () => {
  tick++
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
}

const getCoordinates = () => {
  return ball1.x.toFixed(0) + ball2.x.toFixed() + ball1.y.toFixed(0) + ball2.y.toFixed()
}

test('x and y coordinates', () => {
  // alias
  const c = getCoordinates

  assert.strictEqual(c(), '100700240240')

  update()
  assert.strictEqual(c(), '103697243241')

  update()
  assert.strictEqual(c(), '105693245242')

  update()
  assert.strictEqual(c(), '108690248243')
})
