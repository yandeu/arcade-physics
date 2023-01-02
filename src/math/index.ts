/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import CONST from './const'

import Extend from '../utils/object/Extend'

import Angle from './angle'
import Distance from './distance'
import Easing from './easing'
import Fuzzy from './fuzzy'
import Interpolation from './interpolation'
import Pow2 from './pow2'
import Snap from './snap'

//  Expose the RNG Class
import RandomDataGenerator from './random-data-generator/RandomDataGenerator'
const RND = new RandomDataGenerator()
export { RND }

//  Single functions
import Average from './Average'
import Bernstein from './Bernstein'
import Between from './Between'
import CatmullRom from './CatmullRom'
import CeilTo from './CeilTo'
import Clamp from './Clamp'
import DegToRad from './DegToRad'
import Difference from './Difference'
import Euler from './Euler'
import Factorial from './Factorial'
import FloatBetween from './FloatBetween'
import FloorTo from './FloorTo'
import FromPercent from './FromPercent'
import GetSpeed from './GetSpeed'
import IsEven from './IsEven'
import IsEvenStrict from './IsEvenStrict'
import Linear from './Linear'
import MaxAdd from './MaxAdd'
import Median from './Median'
import MinSub from './MinSub'
import Percent from './Percent'
import RadToDeg from './RadToDeg'
import RandomXY from './RandomXY'
import RandomXYZ from './RandomXYZ'
import RandomXYZW from './RandomXYZW'
import Rotate from './Rotate'
import RotateAround from './RotateAround'
import RotateAroundDistance from './RotateAroundDistance'
import RotateTo from './RotateTo'
import RoundAwayFromZero from './RoundAwayFromZero'
import RoundTo from './RoundTo'
import SinCosTableGenerator from './SinCosTableGenerator'
import SmootherStep from './SmootherStep'
import SmoothStep from './SmoothStep'
import ToXY from './ToXY'
import TransformXY from './TransformXY'
import Within from './Within'
import Wrap from './Wrap'

//  Vector classes
import { Vector2 } from './Vector2.js'
import Vector3 from './Vector3'
import Vector4 from './Vector4'
import Matrix3 from './Matrix3'
import Matrix4 from './Matrix4'
import Quaternion from './Quaternion'
import { RotateVec3 } from './RotateVec3.js'
