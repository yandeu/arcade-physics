/**
 * @author       Niklas von Hertzen (https://github.com/niklasvh/base64-arraybuffer)
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

//  Use a lookup table to find the index.
const lookup = new Uint8Array(256)

for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i
}

/**
 * Converts a base64 string, either with or without a data uri, into an Array Buffer.
 *
 * @function Phaser.Utils.Base64.Base64ToArrayBuffer
 * @since 3.18.0
 *
 * @param {string} base64 - The base64 string to be decoded. Can optionally contain a data URI header, which will be stripped out prior to decoding.
 *
 * @return {ArrayBuffer} An ArrayBuffer decoded from the base64 data.
 */
const Base64ToArrayBuffer = base64 => {
  //  Is it a data uri? if so, strip the header away
  base64 = base64.substr(base64.indexOf(',') + 1)

  const len = base64.length
  let bufferLength = len * 0.75
  let p = 0
  let encoded1
  let encoded2
  let encoded3
  let encoded4

  if (base64[len - 1] === '=') {
    bufferLength--

    if (base64[len - 2] === '=') {
      bufferLength--
    }
  }

  const arrayBuffer = new ArrayBuffer(bufferLength)
  const bytes = new Uint8Array(arrayBuffer)

  for (let i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)]
    encoded2 = lookup[base64.charCodeAt(i + 1)]
    encoded3 = lookup[base64.charCodeAt(i + 2)]
    encoded4 = lookup[base64.charCodeAt(i + 3)]

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
  }

  return arrayBuffer
}

export default Base64ToArrayBuffer
