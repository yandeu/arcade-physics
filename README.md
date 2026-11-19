<div style="text-align: center">
<h1>Arcade Physics<br /><small>(without Phaser)</small></h1>
</div>

<div style="text-align: center; margin-bottom: 8px">
  <a style="text-decoration: none" href="https://github.com/yandeu/arcade-physics/actions/workflows/main.yml">
    <img src="https://github.com/yandeu/arcade-physics/actions/workflows/main.yml/badge.svg" alt="CI" />
  </a>
  <a style="text-decoration: none" href="https://www.npmjs.com/package/arcade-physics">
    <img src="https://img.shields.io/npm/v/arcade-physics" alt="version" />
  </a>
</div>

2D arcade physics for JavaScript games, extracted from the Arcade Physics module of [Phaser](https://github.com/phaserjs/phaser). It runs without the Phaser game framework.

It runs in browsers, on Node.js (tested with 22), and on Bun (tested with 1.2).

## Goal

Detach Arcade Physics from the Phaser package so it can be used on its own in any JavaScript game or canvas project.

## Features

- AABB and circle bodies, static bodies, gravity, bounce, friction, and world bounds
- Collisions and overlaps between bodies
- Tilemap collisions with `createTilesFromGrid`, `collideBodyVsTiles`, and `overlapBodyVsTiles`
- `DebugGraphics` for drawing body outlines
- Group support has been removed. Use a plain array instead of a Group.

## Demo (client-side)

https://yandeu.github.io/arcade-physics/

Also available on html2app: https://html2app.dev/tools/arcade-physics

The demo pages are in [`demo/`](demo/): [`index.html`](demo/index.html), [`tilemap.html`](demo/tilemap.html), and [`server.html`](demo/server.html), which shows a Node.js and Bun script with its console output.

## NPM

```sh
npm i arcade-physics
```

## Usage

```js
import { LoadArcadePhysics } from 'arcade-physics'

const physics = await LoadArcadePhysics({
  width: 800,
  height: 450,
  gravity: { x: 0, y: 300 }
})

const box = physics.add.body(20, 20, 64, 64)
box.setBounce(0.6)
box.setCollideWorldBounds(true)

const platform = physics.add.staticBody(60, 350, 160, 32)
physics.add.collider(box, platform)

let tick = 0
setInterval(() => {
  physics.world.update(tick * 1000, 1000 / 60)
  physics.world.postUpdate()
  tick++
}, 16)
```

For a complete example, see the config and setup in [`demo/index.html`](demo/index.html).

## Development

```sh
git clone https://github.com/yandeu/arcade-physics.git
cd arcade-physics
npm run init      # fetches the pinned Phaser source into src/phaser (.gitmodules uses an SSH URL)
npm install
npm run build     # writes dist/index.js, dist/index.d.ts, and dist/arcade-physics.min.js
npm test
```

## License

MIT License. Copyright (c) 2026 [Yannick Deubel](https://github.com/yandeu)

This project includes code from third-party MIT licensed projects. Their copyright notices and license texts are included in the banner at the top of `dist/index.js`. The type definitions in `dist/phaser.d.ts` and `dist/matter.d.ts` start with Phaser's license notice.

- [Phaser](https://github.com/photonstorm/phaser), Copyright (c) 2013-2026 Richard Davey, Phaser Studio Inc.
- [eventemitter3](https://github.com/primus/eventemitter3), Copyright (c) 2014 Arnout Kazemier
- [rbush](https://github.com/mourner/rbush), Copyright (c) 2024 Volodymyr Agafonkin. Phaser's `RTree.js` is a fork of this code.

See the [LICENSE](LICENSE) file for more details.
