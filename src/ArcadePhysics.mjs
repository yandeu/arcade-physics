// @ts-check
/// <reference path="./phaser/types/phaser.d.ts" />
import EventEmitter from 'eventemitter3'

/**
 * Configuration accepted by {@link LoadArcadePhysics}.
 *
 * @typedef {object} ArcadePhysicsConfig
 * @property {number} width - Width of the simulated world in pixels.
 * @property {number} height - Height of the simulated world in pixels.
 * @property {{ x: number, y: number }} gravity - Gravity applied to dynamic bodies, in pixels per second squared.
 */

/**
 * Draws Arcade Physics body outlines on a 2D canvas context.
 *
 * Used for debugging collision shapes. Each method starts a new path, so
 * calls do not affect each other.
 */
export class DebugGraphics {
  /**
   * The 2D canvas context that receives the drawing commands.
   *
   * @type {CanvasRenderingContext2D}
   */
  ctx

  /**
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   */
  constructor(ctx) {
    this.ctx = ctx
  }

  /**
   * Sets the stroke width and colour for subsequent strokes.
   *
   * @param {number} strokeWidth - Line width in pixels.
   * @param {number} bodyColor - Colour as a 24-bit RGB integer, for example `0xff0000`.
   * @returns {void}
   */
  lineStyle(strokeWidth, bodyColor) {
    this.ctx.lineWidth = strokeWidth
    this.ctx.strokeStyle = '#' + bodyColor.toString(16).padStart(6, '0')
  }

  /**
   * Strokes a circle outline.
   *
   * @param {number} x - Centre x coordinate.
   * @param {number} y - Centre y coordinate.
   * @param {number} radius - Circle radius in pixels.
   * @returns {void}
   */
  strokeCircle(x, y, radius) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.stroke()
  }

  /**
   * Strokes a rectangle outline.
   *
   * @param {number} x - Left edge x coordinate.
   * @param {number} y - Top edge y coordinate.
   * @param {number} width - Rectangle width in pixels.
   * @param {number} height - Rectangle height in pixels.
   * @returns {void}
   */
  strokeRect(x, y, width, height) {
    this.ctx.beginPath()
    this.ctx.rect(x, y, width, height)
    this.ctx.stroke()
  }

  /**
   * Strokes a straight line between two points.
   *
   * @param {number} x1 - Start x coordinate.
   * @param {number} y1 - Start y coordinate.
   * @param {number} x2 - End x coordinate.
   * @param {number} y2 - End y coordinate.
   * @returns {void}
   */
  lineBetween(x1, y1, x2, y2) {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }
}

/**
 * Creates a standalone Arcade Physics world that runs without a Phaser game or scene.
 *
 * The function builds a minimal fake scene around Phaser's Arcade Physics
 * plugin, boots it, and starts it. Advance the simulation yourself with
 * `world.update(time, delta)` followed by `world.postUpdate()`.
 *
 * @param {ArcadePhysicsConfig} config - World size and gravity.
 * @returns {Promise<Phaser.Physics.Arcade.ArcadePhysics>} The booted physics plugin.
 *
 * @example
 * const physics = await LoadArcadePhysics({
 *   width: 800,
 *   height: 450,
 *   gravity: { x: 0, y: 300 }
 * })
 * const box = physics.add.body(20, 20, 64, 64)
 * physics.world.update(0, 1000 / 60)
 * physics.world.postUpdate()
 */
export const LoadArcadePhysics = async config => {
  const scene = {
    sys: {
      game: {
        config: {
          physics: {
            default: 'arcade',
            arcade: {
              debug: false,
              gravity: config.gravity
            }
          }
        }
      },
      events: new EventEmitter(),
      scale: { width: config.width, height: config.height },
      settings: {}
    }
  }
  const cax = await import('./phaser/src/physics/arcade/ArcadePhysics.js')
  // Phaser's JS class is typed as a generic Class. Cast it to its constructor type here.
  const ArcadePhysicsClass =
    /** @type {new (scene: object) => Phaser.Physics.Arcade.ArcadePhysics & { boot(): void, start(): void }} */ (
      /** @type {unknown} */ (cax.default)
    )
  const ca = new ArcadePhysicsClass(scene)
  ca.boot()
  ca.start()
  return ca
}

export {
  DEFAULT_TILE_BIAS,
  createTileLayer,
  createTile,
  createTilesFromGrid,
  collideBodyVsTiles,
  overlapBodyVsTiles
} from './ArcadeTilemap.mjs'
