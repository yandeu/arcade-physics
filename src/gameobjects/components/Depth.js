/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the depth of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Depth
 * @since 3.0.0
 */

const Depth = {
  /**
   * Private internal value. Holds the depth of the Game Object.
   *
   * @name Phaser.GameObjects.Components.Depth#_depth
   * @type {number}
   * @private
   * @default 0
   * @since 3.0.0
   */
  _depth: 0,

  /**
   * The depth of this Game Object within the Scene.
   *
   * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
   * of Game Objects, without actually moving their position in the display list.
   *
   * The default depth is zero. A Game Object with a higher depth
   * value will always render in front of one with a lower value.
   *
   * Setting the depth will queue a depth sort event within the Scene.
   *
   * @name Phaser.GameObjects.Components.Depth#depth
   * @type {number}
   * @since 3.0.0
   */
  depth: {
    get() {
      return this._depth
    },

    set(value) {
      if (this.displayList) {
        this.displayList.queueDepthSort()
      }

      this._depth = value
    }
  },

  /**
   * The depth of this Game Object within the Scene.
   *
   * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
   * of Game Objects, without actually moving their position in the display list.
   *
   * The default depth is zero. A Game Object with a higher depth
   * value will always render in front of one with a lower value.
   *
   * Setting the depth will queue a depth sort event within the Scene.
   *
   * @method Phaser.GameObjects.Components.Depth#setDepth
   * @since 3.0.0
   *
   * @param {number} value - The depth of this Game Object.
   *
   * @return {this} This Game Object instance.
   */
  setDepth(value) {
    if (value === undefined) {
      value = 0
    }

    this.depth = value

    return this
  }
}

export default Depth