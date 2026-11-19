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
const staticBody = physics.add.staticBody(0, 0)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
  tick++
}

test('get default width and height', () => {
  update()
  {
    const { width, height } = body
    assert.strictEqual(width, 64)
    assert.strictEqual(height, 64)
  }
  {
    const { width, height } = staticBody
    assert.strictEqual(width, 64)
    assert.strictEqual(height, 64)
  }
})

test('get updated width and height', () => {
  update()
  {
    body.setSize(50, 50)
    const { width, height } = body
    assert.strictEqual(width, 50)
    assert.strictEqual(height, 50)
  }
  {
    staticBody.setSize(50, 50)
    const { width, height } = staticBody
    assert.strictEqual(width, 50)
    assert.strictEqual(height, 50)
  }
})
