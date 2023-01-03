const { ArcadePhysics } = require('../lib/index.js')

const config = {
  gravity: {
    x: 0,
    y: 0
  },
  width: 800,
  height: 600
}

const physics = new ArcadePhysics(config)
const rect = physics.add.body(100, 100)

let tick = 0

const update = () => {
  // move rect from 100x100 to 200x200 in 1000ms
  if (tick === 0) physics.moveTo(rect, 200, 200, 0, 1000)

  tick++
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate(tick * 1000, 1000 / 60)
}

const getPosition = () => {
  return { x: rect.x.toFixed(0), y: rect.y.toFixed(0) }
}

test('x and y positions', () => {
  let pos = getPosition()
  expect(pos.y).toBe('100')
  expect(pos.x).toBe('100')

  // simulate 1 second
  for (let i = 0; i < 60; i++) update()

  pos = getPosition()
  expect(pos.y).toBe('200')
  expect(pos.x).toBe('200')
})
