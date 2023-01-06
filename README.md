<div style="text-align: center">
<h1>Arcade Physics<br /><small>(without Phaser)</small></h1>
</div>

<div style="text-align: center; margin-bottom: 8px">
  <a style="text-decoration: none" href="https://github.com/yandeu/arcade-physics/actions/workflows/main.yml">
    <img src="https://github.com/yandeu/arcade-physics/actions/workflows/main.yml/badge.svg" alt="CI" />
  </a>
  <a style="text-decoration: none" href="https://github.com/yandeu/arcade-physics/tree/gh-pages/bundle">
    <img
      src="https://badgen.net/badgesize/gzip/yandeu/arcade-physics/gh-pages/bundle/arcade-physics.min.js"
      alt="gzip size"
    />
  </a>
  <a style="text-decoration: none" href="https://www.npmjs.com/package/arcade-physics">
    <img src="https://img.shields.io/npm/v/arcade-physics" alt="version" />
  </a>
  <a style="text-decoration: none" href="https://codecov.io/gh/yandeu/arcade-physics">
    <img
      src="https://codecov.io/gh/yandeu/arcade-physics/branch/main/graph/badge.svg?token=7LZVKzgHUT"
      alt="codecov"
    />
  </a>
</div>

## Goal?

Completely detach the Arcade Physics from the PhaserJS package and convert it to TypeScript.

## Features

- Group support has been removed. Instead of Group, use an array.
- The TileMap files are still there, but can't be used as of now.

## Demo (client-side)

https://yandeu.github.io/arcade-physics/

## NPM

`npm i arcade-physics`

## Usage

See [index.html](https://github.com/yandeu/arcade-physics/blob/main/index.html)

## Breaking Changes

- In version >= 0.0.3 the config has been simplified. Please have a look at:  
  https://github.com/yandeu/arcade-physics/blob/main/index.html#L72

## License

Licensed under LGPL-3.0  
Copyright (c) 2023, [Yannick Deubel](https://github.com/yandeu)

This project is a fork of [photonstorm/phaser](https://github.com/photonstorm/phaser) which is licensed under MIT  
Copyright (c) 2020 Richard Davey, Photon Storm Ltd.

Please have a look at the [LICENSE](LICENSE) for more details.
