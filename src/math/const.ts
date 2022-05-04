/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/** Math const */
enum MATH_CONST {
  /** The value of PI * 2 */
  PI2 = Math.PI * 2,

  /** The value of PI * 0.5 */
  TAU = Math.PI * 0.5,

  /** An epsilon value (1.0e-6) */
  EPSILON = 1.0e-6,

  /** For converting degrees to radians (PI / 180) */
  DEG_TO_RAD = Math.PI / 180,

  /** For converting radians to degrees (180 / PI) */
  RAD_TO_DEG = 180 / Math.PI,

  /**
   * An instance of the Random Number Generator.
   * This is not set until the Game boots.
   */
  // RND = null,

  /**
   * The minimum safe integer this browser supports.
   * We use a const for backward compatibility with Internet Explorer.
   */
  MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991,

  /**
   * The maximum safe integer this browser supports.
   * We use a const for backward compatibility with Internet Explorer.
   */
  MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991
}

export default MATH_CONST
