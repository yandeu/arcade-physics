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

test('get overlapRect', () => {
  const bodies = physics.overlapRect(50, 50, 200, 200)
  expect(bodies.length).toBe(2)
})

test('get overlapRect incl. static bodies', () => {
  const bodies = physics.overlapRect(50, 50, 200, 200, true, true)
  expect(bodies.length).toBe(4)
})

test('get overlapCirc', () => {
  const bodies = physics.overlapCirc(100, 100, 10)
  expect(bodies.length).toBe(1)
})

test('get overlapCirc', () => {
  const bodies = physics.overlapCirc(100, 100, 10, true, true)
  expect(bodies.length).toBe(2)
})
