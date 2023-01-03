import 'source-map-support/register.js'
import { ArcadePhysics } from './lib/index.js'

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

// player
const player = physics.add.body(20, 20, 4, 8)
player.setVelocityX(5)

// platform
const platform = physics.add.staticBody(20, 40, 10, 10)

// collider
physics.add.collider(player, platform)

let tick = 0
const update = () => {
  console.log(platform.y.toFixed(2), player.y.toFixed(2))
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate(tick * 1000, 1000 / 60)
  tick++
}

for (let i = 0; i < 25; i++) {
  update()
}
