// @ts-check
import test from 'node:test'
import assert from 'assert'
import {
  LoadArcadePhysics,
  createTileLayer,
  createTile,
  createTilesFromGrid,
  collideBodyVsTiles,
  overlapBodyVsTiles
} from '../dist/index.js'
import { solidGrid, TILE_SIZE } from '../demo/tilemap/tilemap-data.mjs'

/**
 * Test map: 12x12 tiles of 16px.
 * - column 5 is a wall (world x 80..96)
 * - row 8 is a floor (world y 128..144)
 */
const makeGrid = () =>
  Array.from({ length: 12 }, (_, y) => Array.from({ length: 12 }, (_, x) => (x === 5 || y === 8 ? 1 : 0)))

const makeWorld = async (gravityY = 300) => {
  const physics = await LoadArcadePhysics({ width: 200, height: 200, gravity: { x: 0, y: gravityY } })
  const layer = createTileLayer({ tileWidth: 16, tileHeight: 16 })
  const tiles = createTilesFromGrid(layer, makeGrid())
  return { physics, layer, tiles }
}

/**
 * Advances the physics world one frame and runs tile collision in between,
 * the same order the demo pages use.
 *
 * `blocked` flags are reset by the next world update, so they are recorded
 * right after each collision call. The returned object has `true` for every
 * side that was blocked during any frame.
 *
 * @returns {{ left: boolean, right: boolean, up: boolean, down: boolean }}
 */
const simulate = (physics, bodies, tiles, steps) => {
  const blocked = { left: false, right: false, up: false, down: false }
  let time = 0
  for (let i = 0; i < steps; i++) {
    physics.world.update(time * 1000, 1000 / 60)
    for (const body of bodies) {
      collideBodyVsTiles(body, tiles)
      for (const side of /** @type {const} */ (['left', 'right', 'up', 'down'])) {
        if (body.blocked[side]) blocked[side] = true
      }
    }
    physics.world.postUpdate()
    time++
  }
  return blocked
}

test('falling body stops on top of a floor tile', async () => {
  const { physics, tiles } = await makeWorld()
  const body = physics.add.body(30, 20, 10, 10)

  const blocked = simulate(physics, [body], tiles, 240)

  assert.ok(blocked.down, 'body should be blocked from below')
  assert.ok(Math.abs(body.bottom - 128) < 0.01, `bottom should be 128, got ${body.bottom}`)
})

test('body moving left stops at the right face of a wall tile', async () => {
  const { physics, tiles } = await makeWorld(0)
  const body = physics.add.body(120, 10, 10, 10)
  body.setVelocityX(-100)

  const blocked = simulate(physics, [body], tiles, 120)

  assert.ok(blocked.left, 'body should be blocked on the left')
  assert.ok(Math.abs(body.x - 96) < 0.01, `left edge should be 96, got ${body.x}`)
})

test('collideCallback runs with the body and the tile it hit', async () => {
  const { physics, tiles } = await makeWorld()
  const body = physics.add.body(30, 20, 10, 10)
  const hits = []

  const bodies = [body]
  let time = 0
  for (let i = 0; i < 240; i++) {
    physics.world.update(time * 1000, 1000 / 60)
    for (const b of bodies) {
      collideBodyVsTiles(b, tiles, {
        collideCallback: (hitBody, tile) => hits.push({ hitBody, tile })
      })
    }
    physics.world.postUpdate()
    time++
  }

  assert.ok(hits.length > 0, 'callback should run at least once')
  assert.strictEqual(hits[0].hitBody, body)
  assert.strictEqual(hits[0].tile.y, 8, 'first hit should be the floor row')
})

test('processCallback returning false skips the tile', async () => {
  const { physics, tiles } = await makeWorld()
  const body = physics.add.body(30, 20, 10, 10)
  let time = 0
  for (let i = 0; i < 240; i++) {
    physics.world.update(time * 1000, 1000 / 60)
    collideBodyVsTiles(body, tiles, { processCallback: () => false })
    physics.world.postUpdate()
    time++
  }

  assert.ok(!body.blocked.down, 'body should pass through the floor')
  assert.ok(body.bottom > 128, `body should fall past the floor, bottom is ${body.bottom}`)
})

test('tile collisionCallback returning false ignores that tile', async () => {
  const layer = createTileLayer({ tileWidth: 16, tileHeight: 16 })
  const floor = createTile(layer, 2, 8, { index: 1, collisionCallback: () => false })
  const physics = await LoadArcadePhysics({ width: 200, height: 200, gravity: { x: 0, y: 300 } })
  const body = physics.add.body(30, 20, 10, 10)

  simulate(physics, [body], [floor], 240)

  assert.ok(body.bottom > 128, 'body should fall past the ignored tile')
})

test('overlapBodyVsTiles reports overlap without moving the body', async () => {
  const { physics, tiles } = await makeWorld(0)
  const inside = physics.add.body(82, 10, 10, 10) // overlaps wall column (80..96)
  const outside = physics.add.body(10, 10, 10, 10)

  const xBefore = inside.x
  assert.strictEqual(overlapBodyVsTiles(inside, tiles), true)
  assert.strictEqual(inside.x, xBefore, 'overlap check must not move the body')
  assert.strictEqual(overlapBodyVsTiles(outside, tiles), false)
})

test('createTilesFromGrid skips empty cells and fills tile fields', () => {
  const layer = createTileLayer({ tileWidth: 16, tileHeight: 16 })
  const tiles = createTilesFromGrid(layer, [
    [0, 3],
    [5, 0]
  ])

  assert.strictEqual(tiles.length, 2)
  assert.deepStrictEqual(
    tiles.map(t => [t.x, t.y, t.index]),
    [
      [1, 0, 3],
      [0, 1, 5]
    ]
  )
  assert.strictEqual(tiles[0].width, 16)
  assert.strictEqual(tiles[0].height, 16)
  assert.strictEqual(tiles[0].tilemapLayer, layer)
})

test('tileToWorldXY applies the layer scale and origin', () => {
  const layer = createTileLayer({ tileWidth: 16, tileHeight: 16, x: 10, y: 20, scaleX: 2, scaleY: 3 })
  assert.deepStrictEqual(layer.tileToWorldXY(3, 1), { x: 10 + 3 * 16 * 2, y: 20 + 1 * 16 * 3 })
})

test('demo map: bodies bounce off walls and never overlap them', async () => {
  const physics = await LoadArcadePhysics({ width: 512, height: 320, gravity: { x: 0, y: 0 } })
  const layer = createTileLayer({ tileWidth: TILE_SIZE, tileHeight: TILE_SIZE })
  const walls = createTilesFromGrid(layer, solidGrid)
  const ball = physics.add.body(60, 292, 12, 12)
  ball.setVelocity(70, 60)
  ball.setBounce(1)
  ball.setCollideWorldBounds(true)
  const box = physics.add.body(300, 292, 14, 14)
  box.setVelocityX(-90)
  box.setBounce(1)
  box.setCollideWorldBounds(true)
  const bodies = [ball, box]

  let time = 0
  let overlaps = 0
  let boxBounces = 0
  let lastBoxVx = box.velocity.x
  for (let i = 0; i < 1200; i++) {
    physics.world.update(time * 1000, 1000 / 60)
    for (const body of bodies) {
      collideBodyVsTiles(body, walls)
    }
    physics.world.postUpdate()
    time++

    for (const body of bodies) {
      if (overlapBodyVsTiles(body, walls)) overlaps++
    }
    if (Math.sign(box.velocity.x) !== Math.sign(lastBoxVx) && lastBoxVx !== 0) boxBounces++
    lastBoxVx = box.velocity.x
  }

  assert.strictEqual(overlaps, 0, 'no body should end a step inside a wall')
  assert.ok(boxBounces > 0, 'box should bounce off the walls at least once')
})
