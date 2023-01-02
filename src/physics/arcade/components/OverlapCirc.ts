import OverlapRect from './OverlapRect'
import { Circle } from '../../../geom/circle/Circle'
import CircleToCircle from '../../../geom/intersects/CircleToCircle'
import CircleToRectangle from '../../../geom/intersects/CircleToRectangle'
import { Body } from '../Body'
import { StaticBody } from '../StaticBody'
import { World } from '../World'

/**
 * This method will search the given circular area and return an array of all physics bodies that
 * overlap with it. It can return either Dynamic, Static bodies or a mixture of both.
 *
 * A body only has to intersect with the search area to be considered, it doesn't have to be fully
 * contained within it.
 *
 * If Arcade Physics is set to use the RTree (which it is by default) then the search is rather fast,
 * otherwise the search is O(N) for Dynamic Bodies.
 *
 * @function Phaser.Physics.Arcade.Components.OverlapCirc
 * @since 3.21.0
 *
 * @param {number} x - The x coordinate of the center of the area to search within.
 * @param {number} y - The y coordinate of the center of the area to search within.
 * @param {number} radius - The radius of the area to search within.
 * @param {boolean} [includeDynamic=true] - Should the search include Dynamic Bodies?
 * @param {boolean} [includeStatic=false] - Should the search include Static Bodies?
 *
 * @return {(Phaser.Physics.Arcade.Body[]|Phaser.Physics.Arcade.StaticBody[])} An array of bodies that overlap with the given area.
 */
const OverlapCirc = function (
  world: World,
  x: number,
  y: number,
  radius: number,
  includeDynamic = true,
  includeStatic = false
): Array<Body | StaticBody> {
  const bodiesInRect = OverlapRect(
    world,
    x - radius,
    y - radius,
    2 * radius,
    2 * radius,
    includeDynamic,
    includeStatic
  ) as Array<Body | StaticBody>

  if (bodiesInRect.length === 0) {
    return bodiesInRect
  }

  const area = new Circle(x, y, radius)
  const circFromBody = new Circle()
  const bodiesInArea: Array<Body | StaticBody> = []

  for (let i = 0; i < bodiesInRect.length; i++) {
    const body = bodiesInRect[i]

    if (body.isCircle) {
      circFromBody.setTo(body.center.x, body.center.y, body.halfWidth)

      if (CircleToCircle(area, circFromBody)) {
        bodiesInArea.push(body)
      }
    } else if (CircleToRectangle(area, body)) {
      bodiesInArea.push(body)
    }
  }

  return bodiesInArea
}

export default OverlapCirc
