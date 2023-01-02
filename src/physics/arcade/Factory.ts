/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Body } from './Body'
import { StaticBody } from './StaticBody'
import { ArcadePhysicsCallback, ArcadeProcessCallback, CollisionCallback } from './typedefs/types'
import type { World } from './World'

export class Factory {
  scene: any
  sys: any

  /**
   * The Arcade Physics Factory allows you to easily create Arcade Physics enabled Game Objects.
   * Objects that are created by this Factory are automatically added to the physics world.
   *
   * @param world The Arcade Physics World instance.
   */
  constructor(public world: World) {
    /** A reference to the Scene this Arcade Physics instance belongs to. */
    this.scene = world.scene

    /** A reference to the Scene.Systems this Arcade Physics instance belongs to.  */
    this.sys = world.scene.sys
  }

  /** Creates a new Dynamic Arcade Body. */
  public body(x: number, y: number, width = 64, height = 64): Body {
    const body = new Body(this.world, x, y, width, height)
    this.world.add(body)
    return body
  }

  /** Creates a new Static Arcade Physics Body. */
  public staticBody(x: number, y: number, width = 64, height = 64): StaticBody {
    const staticBody = new StaticBody(this.world, x, y, width, height)
    this.world.add(staticBody)
    return staticBody
  }

  /**
   * Creates a new Arcade Physics Collider object.
   *
   * @param body1 - The first object to check for collision.
   * @param body2 - The second object to check for collision.
   * @param [collideCallback] - The callback to invoke when the two objects collide.
   * @param [processCallback] - The callback to invoke when the two objects collide. Must return a boolean.
   * @param [callbackContext] - The scope in which to call the callbacks.
   *
   * @return The Collider that was created.
   */
  public collider(
    body1: Body | StaticBody | Array<Body | StaticBody>,
    body2: Body | StaticBody | Array<Body | StaticBody>,
    collideCallback?: CollisionCallback,
    processCallback?: CollisionCallback,
    callbackContext?: any
  ) {
    return this.world.addCollider(body1, body2, collideCallback, processCallback, callbackContext)
  }

  /**
   * Creates a new Arcade Physics Collider Overlap object.
   *
   * @param body1 - The first object to check for overlap.
   * @param body2 - The second object to check for overlap.
   * @param [collideCallback] - The callback to invoke when the two objects collide.
   * @param [processCallback] - The callback to invoke when the two objects collide. Must return a boolean.
   * @param [callbackContext] - The scope in which to call the callbacks.
   *
   * @return The Collider that was created.
   */
  public overlap(
    body1: Body | StaticBody | Array<Body | StaticBody>,
    body2: Body | StaticBody | Array<Body | StaticBody>,
    collideCallback?: ArcadePhysicsCallback,
    processCallback?: ArcadeProcessCallback,
    callbackContext?: any
  ) {
    return this.world.addOverlap(body1, body2, collideCallback, processCallback, callbackContext)
  }

  /** Destroys this Factory. */
  public destroy(): void {
    // @ts-ignore
    this.world = null
    // @ts-ignore
    this.scene = null
    // @ts-ignore
    this.sys = null
  }
}
