/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import type { Body } from './Body'
import type { StaticBody } from './StaticBody'
import { ArcadePhysicsCallback, ArcadeProcessCallback } from './typedefs/types'
import type { World } from './World'

export class Collider {
  /** The name of the collider (unused by Phaser). */
  name = ''
  /** Whether the collider is active. */
  active = true

  /**
   * An Arcade Physics Collider will automatically check for collision, or overlaps, between two objects
   * every step. If a collision, or overlap, occurs it will invoke the given callbacks.
   *
   * @param world The world in which the bodies will collide.
   * @param overlapOnly Whether to check for collisions or overlaps.
   * @param body1 The first object to check for collision.
   * @param body2 The second object to check for collision.
   * @param collideCallback The callback to invoke when the two objects collide.
   * @param processCallback If a processCallback exists it must return true or collision checking will be skipped.
   * @param callbackContext The context the collideCallback and processCallback will run in.
   */
  constructor(
    public world: World,
    public overlapOnly: boolean,
    public body1: Body | StaticBody | Array<Body | StaticBody>,
    public body2: Body | StaticBody | Array<Body | StaticBody>,
    public collideCallback: ArcadePhysicsCallback,
    public processCallback: ArcadeProcessCallback,
    public callbackContext
  ) {}

  /**
   * A name for the Collider.
   *
   * Phaser does not use this value, it's for your own reference.
   */
  public setName(name: string): this {
    this.name = name
    return this
  }

  /** Called by World as part of its step processing, initial operation of collision checking. */
  private update(): void {
    this.world.collideObjects(
      this.body1,
      this.body2,
      this.collideCallback,
      this.processCallback,
      this.callbackContext,
      this.overlapOnly
    )
  }

  /** Removes Collider from World and disposes of its resources. */
  destroy(): void {
    this.world.removeCollider(this)

    this.active = false

    // @ts-ignore
    this.world = null

    // @ts-ignore
    this.body1 = null
    // @ts-ignore
    this.body2 = null

    // @ts-ignore
    this.collideCallback = null
    // @ts-ignore
    this.processCallback = null
    this.callbackContext = null
  }
}
