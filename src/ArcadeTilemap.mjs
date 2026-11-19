// @ts-check
/// <reference path="./phaser/types/phaser.d.ts" />
import TileCollision from './phaser/src/physics/arcade/tilemap/index.js'

/**
 * Tile overlap tolerance used when separating a body from a tile.
 * Matches the default `tileBias` of Phaser's Arcade Physics world.
 */
export const DEFAULT_TILE_BIAS = 16

/**
 * A tile layer describes how tile coordinates map to world coordinates.
 *
 * @typedef {object} TileLayer
 * @property {number} tileWidth - Width of one tile in pixels, before scaling.
 * @property {number} tileHeight - Height of one tile in pixels, before scaling.
 * @property {number} scaleX - Horizontal scale applied to the layer.
 * @property {number} scaleY - Vertical scale applied to the layer.
 * @property {(tileX: number, tileY: number) => { x: number, y: number }} tileToWorldXY - Converts tile coordinates to the world position of the tile's top-left corner.
 */

/**
 * A tile that bodies can collide with.
 *
 * @typedef {object} Tile
 * @property {number} x - Column of the tile in the layer.
 * @property {number} y - Row of the tile in the layer.
 * @property {number} index - Tile index. Use it to tell tile types apart.
 * @property {number} width - Width in tile units, equal to the layer's `tileWidth`.
 * @property {number} height - Height in tile units, equal to the layer's `tileHeight`.
 * @property {TileLayer} tilemapLayer - The layer that owns this tile.
 * @property {((body: Phaser.Physics.Arcade.Body, tile: Tile) => boolean)} [collisionCallback] - Called before a collision is processed. Return `true` to let the collision happen and `false` to ignore this tile for this body.
 */

/**
 * Options for {@link collideBodyVsTiles} and {@link overlapBodyVsTiles}.
 *
 * @typedef {object} TileCollisionOptions
 * @property {(body: Phaser.Physics.Arcade.Body, tile: Tile) => void} [collideCallback] - Called after a body collides with a tile (or overlaps it, for overlap checks).
 * @property {(body: Phaser.Physics.Arcade.Body, tile: Tile) => boolean} [processCallback] - Called before the collision check. Return `false` to skip the tile.
 * @property {any} [callbackContext] - The `this` value for the callbacks above.
 * @property {number} [tileBias] - Overlap tolerance in pixels. Defaults to {@link DEFAULT_TILE_BIAS}.
 */

/**
 * Creates a tile layer that maps tile coordinates to world coordinates.
 *
 * @param {object} options
 * @param {number} options.tileWidth - Width of one tile in pixels, before scaling.
 * @param {number} options.tileHeight - Height of one tile in pixels, before scaling.
 * @param {number} [options.x=0] - World x position of the layer's top-left corner.
 * @param {number} [options.y=0] - World y position of the layer's top-left corner.
 * @param {number} [options.scaleX=1] - Horizontal scale of the layer.
 * @param {number} [options.scaleY=1] - Vertical scale of the layer.
 * @returns {TileLayer}
 *
 * @example
 * const layer = createTileLayer({ tileWidth: 32, tileHeight: 32 })
 */
export const createTileLayer = ({ tileWidth, tileHeight, x = 0, y = 0, scaleX = 1, scaleY = 1 }) => ({
  tileWidth,
  tileHeight,
  scaleX,
  scaleY,
  tileToWorldXY: (tileX, tileY) => ({
    x: x + tileX * tileWidth * scaleX,
    y: y + tileY * tileHeight * scaleY
  })
})

/**
 * Creates a single tile on a layer.
 *
 * @param {TileLayer} layer - The layer that owns the tile.
 * @param {number} x - Column of the tile in the layer.
 * @param {number} y - Row of the tile in the layer.
 * @param {object} [options]
 * @param {number} [options.index=0] - Tile index.
 * @param {(body: Phaser.Physics.Arcade.Body, tile: Tile) => boolean} [options.collisionCallback] - Per-tile callback. See {@link Tile}.
 * @returns {Tile}
 */
export const createTile = (layer, x, y, options = {}) => ({
  x,
  y,
  index: options.index ?? 0,
  width: layer.tileWidth,
  height: layer.tileHeight,
  tilemapLayer: layer,
  collisionCallback: options.collisionCallback
})

/**
 * Builds tiles from a grid of tile indices. Cells with index `0` are empty and are skipped.
 *
 * @param {TileLayer} layer - The layer that owns the tiles.
 * @param {number[][]} grid - Rows of tile indices, indexed as `grid[row][column]`.
 * @returns {Tile[]}
 *
 * @example
 * const tiles = createTilesFromGrid(layer, [
 *   [0, 0, 0],
 *   [1, 1, 1]
 * ])
 */
export const createTilesFromGrid = (layer, grid) => {
  /** @type {Tile[]} */
  const tiles = []
  grid.forEach((row, y) => {
    row.forEach((index, x) => {
      if (index !== 0) {
        tiles.push(createTile(layer, x, y, { index }))
      }
    })
  })
  return tiles
}

/**
 * Runs the tile loop shared by collision and overlap checks.
 *
 * @param {Phaser.Physics.Arcade.Body} body
 * @param {Tile[]} tiles
 * @param {TileCollisionOptions} options
 * @param {boolean} overlapOnly - When true, the body is not moved out of the tiles.
 * @returns {boolean} True if the body touched at least one tile.
 */
const processTiles = (body, tiles, options, overlapOnly) => {
  const { collideCallback, processCallback, callbackContext } = options
  const tileBias = options.tileBias ?? DEFAULT_TILE_BIAS
  let touched = false

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i]
    const layer = tile.tilemapLayer
    const origin = layer.tileToWorldXY(tile.x, tile.y)
    /** @type {{ left: number, right: number, top: number, bottom: number }} */
    const rect = {
      left: origin.x,
      top: origin.y,
      right: origin.x + tile.width * layer.scaleX,
      bottom: origin.y + tile.height * layer.scaleY
    }

    if (!TileCollision.TileIntersectsBody(rect, body)) continue
    if (processCallback && !processCallback.call(callbackContext, body, tile)) continue
    if (tile.collisionCallback && !tile.collisionCallback(body, tile)) continue

    // Every face of a standalone tile is solid, so isLayer is false.
    // Our Tile typedef is a subset of Phaser's Tile. The runtime object carries the rest.
    const phaserTile = /** @type {Phaser.Tilemaps.Tile} */ (/** @type {unknown} */ (tile))
    const phaserRect = /** @type {Phaser.Geom.Rectangle} */ (/** @type {unknown} */ (rect))
    const phaserLayer = /** @type {Phaser.Tilemaps.TilemapLayer} */ (/** @type {unknown} */ (layer))
    if (!overlapOnly && !TileCollision.SeparateTile(i, body, phaserTile, phaserRect, phaserLayer, tileBias, false)) continue

    touched = true
    if (collideCallback) {
      collideCallback.call(callbackContext, body, tile)
    }
  }

  return touched
}

/**
 * Checks a body against tiles and pushes it out of any tile it hits.
 *
 * Call this after `physics.world.update()` each step. Pass the tiles that can
 * be near the body. The function does not filter by distance.
 *
 * @param {Phaser.Physics.Arcade.Body} body - A body created by `physics.add.body()`.
 * @param {Tile[]} tiles - Tiles to test against.
 * @param {TileCollisionOptions} [options]
 * @returns {boolean} True if the body collided with at least one tile.
 */
export const collideBodyVsTiles = (body, tiles, options = {}) => processTiles(body, tiles, options, false)

/**
 * Reports which tiles a body overlaps without moving the body.
 *
 * @param {Phaser.Physics.Arcade.Body} body - A body created by `physics.add.body()`.
 * @param {Tile[]} tiles - Tiles to test against.
 * @param {TileCollisionOptions} [options]
 * @returns {boolean} True if the body overlaps at least one tile.
 */
export const overlapBodyVsTiles = (body, tiles, options = {}) => processTiles(body, tiles, options, true)
