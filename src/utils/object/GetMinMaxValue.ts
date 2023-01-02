/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import GetValue from './GetValue'

import Clamp from '../../math/Clamp'

/**
 * Retrieves and clamps a numerical value from an object.
 *
 * @function Phaser.Utils.Objects.GetMinMaxValue
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`).
 * @param {number} min - The minimum value which can be returned.
 * @param {number} max - The maximum value which can be returned.
 * @param {number} defaultValue - The value to return if the property doesn't exist. It's also constrained to the given bounds.
 *
 * @return {number} The clamped value from the `source` object.
 */
const GetMinMaxValue = (source, key, min, max, defaultValue) => {
  if (defaultValue === undefined) {
    defaultValue = min
  }

  const value = GetValue(source, key, defaultValue)

  return Clamp(value, min, max)
}

export default GetMinMaxValue
