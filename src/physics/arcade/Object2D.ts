import { GameObject } from '../../gameobjects/GameObject'
import type { Body } from './Body'

export class Object2D extends GameObject {
  body!: Body
  x: number
  y: number
  angle: number
  scaleX: number
  scaleY: number
  displayOriginX: number
  displayOriginY: number
  width: number
  height: number
  displayWidth: number
  displayHeight: number
  originX: number
  originY: number

  // we don't have frames
  frame = false

  getTopLeft = (arg: any) => {}
  getCenter = false

  constructor(scene: any, x: number, y: number, width = 64, height = 64) {
    super(scene, 'Object2D')

    if (typeof scene !== 'object') {
      console.log('ERROR: The first param of "Object2D" should be the "scene"')
    }

    this.x = x
    this.y = y
    this.angle = 0
    this.scaleX = 1
    this.scaleY = 1
    this.displayOriginX = 0
    this.displayOriginY = 0
    this.originX = 0
    this.originY = 0
    this.active = true
    this.width = width
    this.height = height
    this.displayWidth = width
    this.displayHeight = height
  }

  on = ev => {
    // nothing
  }

  /**
   * Sets the position of the Object.
   *
   * @param {number} x - The X coordinate of the top left corner of the Object.
   * @param {number} [y=x] - The Y coordinate of the top left corner of the Object.
   * */
  setPosition(x, y) {
    if (y === undefined) y = x
    this.x = x
    this.y = y
    return this
  }

  setVisible(value) {
    this.visible = value
    return this
  }
}
