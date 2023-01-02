import { BBox } from 'rbush'
import { StaticBody } from '../StaticBody'

export interface ArcadeBodyBounds {
  /** The left edge. */
  x: number
  /** The upper edge. */
  y: number
  /** The right edge. */
  right: number
  /** The lower edge. */
  bottom: number
}

export interface CollisionCallback {
  /** True if the Body is not colliding. */
  none: boolean
  /** True if the Body is colliding on its upper edge. */
  up: boolean
  /** True if the Body is colliding on its lower edge. */
  down: boolean
  /** True if the Body is colliding on its left edge. */
  left: boolean
  /** True if the Body is colliding on its right edge. */
  right: boolean
}

export type ArcadeProcessCallback = () => boolean

export type ArcadePhysicsCallback = (
  body1: Body | StaticBody,
  body2: Body | StaticBody
) => (body1: Body | StaticBody, body2: Body | StaticBody) => void

export interface ArcadeWorldConfig {
  overlapBias?: number
  gravity: {
    x: number
    y: number
  }
  width: number
  height: number
}

/** Default debug display settings for new Bodies. */
export interface ArcadeWorldDefaults {
  /** Set to `true` to render dynamic body outlines to the debug display. */
  debugShowBody: boolean
  /** Set to `true` to render static body outlines to the debug display. */
  debugShowStaticBody: boolean
  /** Set to `true` to render body velocity markers to the debug display. */
  debugShowVelocity: boolean
  /** The color of dynamic body outlines when rendered to the debug display. */
  bodyDebugColor: number
  /** The color of static body outlines when rendered to the debug display. */
  staticBodyDebugColor: number
  /** The color of the velocity markers when rendered to the debug display. */
  velocityDebugColor: number
}

/** Recycled input for tree searches. */
export type ArcadeWorldTreeMinMax = BBox

export interface CheckCollisionObject {
  /** Will bodies collide with the top side of the world bounds? */
  up: boolean
  /** Will bodies collide with the bottom side of the world bounds? */
  down: boolean
  /** Will bodies collide with the left side of the world bounds? */
  left: boolean
  /** Will bodies collide with the right side of the world bounds? */
  right: boolean
}
