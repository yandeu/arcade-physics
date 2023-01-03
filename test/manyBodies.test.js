const { ArcadePhysics } = require('../lib/index.js')

const config = {
  gravity: {
    x: 0,
    y: 200
  },
  width: 800,
  height: 600
}

// physics
const physics = new ArcadePhysics(config)

const bodies = []

const getRandomBody = () => {
  return Math.floor(Math.random() * bodies.length)
}

const addRandomBody = () => {
  const x = Math.random() * 600 + 100
  const y = Math.random() * 400 + 100
  const body = Math.random() > 0.9 ? physics.add.staticBody(x, y) : physics.add.body(x, y)
  if (Math.random() > 0.75) body.setCircle(parseInt(Math.random() * 40 + 20))
  if (body.setVelocityX) body.setVelocityX(parseInt((Math.random() - 0.5) * 20))
  if (body.setBounce) body.setBounce(0.8)
  return body
}

test('should not throw any error', () => {
  for (let i = 0; i < 50; i++) {
    const body = addRandomBody()
    // set collider between all bodies
    bodies.forEach(b => (Math.random() > 0.5 ? physics.add.collider(b, body) : physics.add.overlap(b, body)))
    bodies.push(body)
  }

  let tick = 0
  const update = () => {
    physics.world.update(tick * 1000, 1000 / 60)
    physics.world.postUpdate(tick * 1000, 1000 / 60)
    tick++
  }

  for (let i = 0; i < 60 * 10; i++) {
    update()

    // global collide and overlap
    physics.collide(getRandomBody(), getRandomBody(), () => {})
    physics.overlap(getRandomBody(), getRandomBody(), () => {})
  }
})
