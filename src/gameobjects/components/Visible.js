/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  bitmask flag for GameObject.renderMask
const _FLAG = 1 // 0001

/**
 * Provides methods used for setting the visibility of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Visible
 * @since 3.0.0
 */

const Visible = {
  /**
   * Private internal value. Holds the visible value.
   *
   * @name Phaser.GameObjects.Components.Visible#_visible
   * @type {boolean}
   * @private
   * @default true
   * @since 3.0.0
   */
  _visible: true,

  /**
   * The visible state of the Game Object.
   *
   * An invisible Game Object will skip rendering, but will still process update logic.
   *
   * @name Phaser.GameObjects.Components.Visible#visible
   * @type {boolean}
   * @since 3.0.0
   */
  visible: {
    get() {
      return this._visible
    },

    set(value) {
      if (value) {
        this._visible = true
        this.renderFlags |= _FLAG
      } else {
        this._visible = false
        this.renderFlags &= ~_FLAG
      }
    }
  },

  /**
   * Sets the visibility of this Game Object.
   *
   * An invisible Game Object will skip rendering, but will still process update logic.
   *
   * @method Phaser.GameObjects.Components.Visible#setVisible
   * @since 3.0.0
   *
   * @param {boolean} value - The visible state of the Game Object.
   *
   * @return {this} This Game Object instance.
   */
  setVisible(value) {
    this.visible = value

    return this
  }
}

export default Visible
