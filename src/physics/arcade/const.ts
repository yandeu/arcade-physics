/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/** Physics Types */
export enum PHYSICS_TYPE {
  /** Dynamic Body. */
  DYNAMIC_BODY = 0,
  /** Static Body. */
  STATIC_BODY = 1,
  /** Arcade Physics Group containing Dynamic Bodies. */
  GROUP = 2,
  /** A Tilemap Layer. */
  TILEMAPLAYER = 3
}

/** Facing direction. */
export enum FACING {
  /** Facing no direction (initial value). */
  FACING_NONE = 10,
  /** Facing up. */
  FACING_UP = 11,
  /** Facing down. */
  FACING_DOWN = 12,
  /** Facing left. */
  FACING_LEFT = 13,
  /** Facing right. */
  FACING_RIGHT = 14
}

export default {
  PHYSICS_TYPE,
  FACING
}
