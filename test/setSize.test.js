const { experiments } = require('webpack')
const { ArcadePhysics } = require('../lib/index.js')

const config = {
  gravity: {
    x: 0,
    y: 200
  },
  width: 800,
  height: 600
}

const physics = new ArcadePhysics(config)

const body = physics.add.body(0, 0)
const staticBody = physics.add.staticBody(0, 0)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate(tick * 1000, 1000 / 60)
  tick++
}

test('get default width and height', () => {
  update()
  {
    const { width, height } = body
    expect(width).toBe(64)
    expect(height).toBe(64)
  }
  {
    const { width, height } = staticBody
    expect(width).toBe(64)
    expect(height).toBe(64)
  }
})

test('get updated width and height', () => {
  update()
  {
    body.setSize(50, 50)
    const { width, height } = body
    expect(width).toBe(50)
    expect(height).toBe(50)
  }
  {
    staticBody.setSize(50, 50)
    const { width, height } = staticBody
    expect(width).toBe(50)
    expect(height).toBe(50)
  }
})
