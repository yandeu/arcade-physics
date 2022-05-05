/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Polygon from './Polygon'

/**
 * Create a new polygon which is a copy of the specified polygon
 *
 * @function Phaser.Geom.Polygon.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon to create a clone of
 *
 * @return {Phaser.Geom.Polygon} A new separate Polygon cloned from the specified polygon, based on the same points.
 */
const Clone = polygon => {
  return new Polygon(polygon.points)
}

export default Clone
