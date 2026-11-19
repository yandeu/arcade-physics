import { LoadArcadePhysics } from './dist/index.js'

const config = {
  width: 800,
  height: 450,
  gravity: {
    x: 300,
    y: 300
  }
}

const physics = await LoadArcadePhysics(config)

// box
const box = physics.add.body(20, 20, 64, 64)
box.setVelocityX(20)
box.setBounce(0.6)
box.setCollideWorldBounds(true)

// ball
const ball = physics.add.body(206, 20)
ball.setCircle(32)
ball.setBounce(0.8)
ball.setCollideWorldBounds(true)

// platform
const platform = physics.add.staticBody(60, 350, 160, 32)

// colliders
physics.add.collider(box, ball)
physics.add.collider(box, platform)
physics.add.collider(ball, platform)

let tick = 0
const update = () => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()

  console.log(box.y)
  tick++
}

setInterval(() => {
  update()
}, 16)

// const world = World(scene, config)
