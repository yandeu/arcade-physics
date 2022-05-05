/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import renderWebGL from '../../../utils/NOOP'

import renderCanvas from '../../../utils/NOOP'

if (typeof WEBGL_RENDERER) {
  renderWebGL = require('./StarWebGLRenderer')
}

if (typeof CANVAS_RENDERER) {
  renderCanvas = require('./StarCanvasRenderer')
}

export default {
  renderWebGL: renderWebGL,
  renderCanvas: renderCanvas
}
