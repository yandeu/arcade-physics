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

const body = physics.add.body(0, 0, 64, 64)
const staticBody = physics.add.staticBody(0, 0, 64, 64)

test('hitTest', () => {
  expect(body.hitTest(20, 20)).toBeTruthy()
  expect(body.hitTest(80, 20)).toBeFalsy()

  expect(staticBody.hitTest(20, 20)).toBeTruthy()
  expect(staticBody.hitTest(80, 20)).toBeFalsy()
})
