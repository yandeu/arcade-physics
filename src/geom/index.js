/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import CONST from './const'

import Extend from '../utils/object/Extend'

/**
 * @namespace Phaser.Geom
 */

let Geom = {
  Circle: require('./circle'),
  Ellipse: require('./ellipse'),
  Intersects: require('./intersects'),
  Line: require('./line'),
  Mesh: require('./mesh'),
  Point: require('./point'),
  Polygon: require('./polygon'),
  Rectangle: require('./rectangle'),
  Triangle: require('./triangle')
}

//   Merge in the consts
Geom = Extend(false, Geom, CONST)

export default Geom
