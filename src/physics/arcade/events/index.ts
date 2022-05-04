/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export default {
  /**
   * The Arcade Physics World Collide Event.
   *
   * This event is dispatched by an Arcade Physics World instance if two bodies collide _and_ at least
   * one of them has their [onCollide]{@link Phaser.Physics.Arcade.Body#onCollide} property set to `true`.
   *
   * It provides an alternative means to handling collide events rather than using the callback approach.
   *
   * Listen to it from a Scene using: `this.physics.world.on('collide', listener)`.
   *
   * Please note that 'collide' and 'overlap' are two different things in Arcade Physics.
   *
   * @param {Phaser.GameObjects.GameObject} gameObject1 - The first Game Object involved in the collision. This is the parent of `body1`.
   * @param {Phaser.GameObjects.GameObject} gameObject2 - The second Game Object involved in the collision. This is the parent of `body2`.
   * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body1 - The first Physics Body involved in the collision.
   * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body2 - The second Physics Body involved in the collision.
   */
  COLLIDE: 'collide',
  /**
   * The Arcade Physics World Overlap Event.
   *
   * This event is dispatched by an Arcade Physics World instance if two bodies overlap _and_ at least
   * one of them has their [onOverlap]{@link Phaser.Physics.Arcade.Body#onOverlap} property set to `true`.
   *
   * It provides an alternative means to handling overlap events rather than using the callback approach.
   *
   * Listen to it from a Scene using: `this.physics.world.on('overlap', listener)`.
   *
   * Please note that 'collide' and 'overlap' are two different things in Arcade Physics.
   *
   * @event Phaser.Physics.Arcade.Events#OVERLAP
   * @since 3.0.0
   *
   * @param {Phaser.GameObjects.GameObject} gameObject1 - The first Game Object involved in the overlap. This is the parent of `body1`.
   * @param {Phaser.GameObjects.GameObject} gameObject2 - The second Game Object involved in the overlap. This is the parent of `body2`.
   * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body1 - The first Physics Body involved in the overlap.
   * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body2 - The second Physics Body involved in the overlap.
   */
  OVERLAP: 'overlap',
  /**
   * The Arcade Physics World Pause Event.
   *
   * This event is dispatched by an Arcade Physics World instance when it is paused.
   *
   * Listen to it from a Scene using: `this.physics.world.on('pause', listener)`.
   *
   * @event Phaser.Physics.Arcade.Events#PAUSE
   * @since 3.0.0
   */
  PAUSE: 'pause',
  /**
   * The Arcade Physics World Resume Event.
   *
   * This event is dispatched by an Arcade Physics World instance when it resumes from a paused state.
   *
   * Listen to it from a Scene using: `this.physics.world.on('resume', listener)`.
   *
   * @event Phaser.Physics.Arcade.Events#RESUME
   * @since 3.0.0
   */
  RESUME: 'resume',
  /**
   * The Arcade Physics Tile Collide Event.
   *
   * This event is dispatched by an Arcade Physics World instance if a body collides with a Tile _and_
   * has its [onCollide]{@link Phaser.Physics.Arcade.Body#onCollide} property set to `true`.
   *
   * It provides an alternative means to handling collide events rather than using the callback approach.
   *
   * Listen to it from a Scene using: `this.physics.world.on('tilecollide', listener)`.
   *
   * Please note that 'collide' and 'overlap' are two different things in Arcade Physics.
   *
   * @event Phaser.Physics.Arcade.Events#TILE_COLLIDE
   * @since 3.16.1
   *
   * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object involved in the collision. This is the parent of `body`.
   * @param {Phaser.Tilemaps.Tile} tile - The tile the body collided with.
   * @param {Phaser.Physics.Arcade.Body} body - The Arcade Physics Body of the Game Object involved in the collision.
   */
  TILE_COLLIDE: 'tilecollide',
  /**
   * The Arcade Physics Tile Overlap Event.
   *
   * This event is dispatched by an Arcade Physics World instance if a body overlaps with a Tile _and_
   * has its [onOverlap]{@link Phaser.Physics.Arcade.Body#onOverlap} property set to `true`.
   *
   * It provides an alternative means to handling overlap events rather than using the callback approach.
   *
   * Listen to it from a Scene using: `this.physics.world.on('tileoverlap', listener)`.
   *
   * Please note that 'collide' and 'overlap' are two different things in Arcade Physics.
   *
   * @event Phaser.Physics.Arcade.Events#TILE_OVERLAP
   * @since 3.16.1
   *
   * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object involved in the overlap. This is the parent of `body`.
   * @param {Phaser.Tilemaps.Tile} tile - The tile the body overlapped.
   * @param {Phaser.Physics.Arcade.Body} body - The Arcade Physics Body of the Game Object involved in the overlap.
   */
  TILE_OVERLAP: 'tileoverlap',
  /**
   * The Arcade Physics World Bounds Event.
   *
   * This event is dispatched by an Arcade Physics World instance if a body makes contact with the world bounds _and_
   * it has its [onWorldBounds]{@link Phaser.Physics.Arcade.Body#onWorldBounds} property set to `true`.
   *
   * It provides an alternative means to handling collide events rather than using the callback approach.
   *
   * Listen to it from a Scene using: `this.physics.world.on('worldbounds', listener)`.
   *
   * @event Phaser.Physics.Arcade.Events#WORLD_BOUNDS
   * @since 3.0.0
   *
   * @param {Phaser.Physics.Arcade.Body} body - The Arcade Physics Body that hit the world bounds.
   * @param {boolean} up - Is the Body blocked up? I.e. collided with the top of the world bounds.
   * @param {boolean} down - Is the Body blocked down? I.e. collided with the bottom of the world bounds.
   * @param {boolean} left - Is the Body blocked left? I.e. collided with the left of the world bounds.
   * @param {boolean} right - Is the Body blocked right? I.e. collided with the right of the world bounds.
   */
  WORLD_BOUNDS: 'worldbounds',
  /**
   * The Arcade Physics World Step Event.
   *
   * This event is dispatched by an Arcade Physics World instance whenever a physics step is run.
   * It is emitted _after_ the bodies and colliders have been updated.
   *
   * In high framerate settings this can be multiple times per game frame.
   *
   * Listen to it from a Scene using: `this.physics.world.on('worldstep', listener)`.
   *
   * @event Phaser.Physics.Arcade.Events#WORLD_STEP
   * @since 3.18.0
   *
   * @param {number} delta - The delta time amount of this step, in seconds.
   */
  WORLD_STEP: 'worldstep'
}
