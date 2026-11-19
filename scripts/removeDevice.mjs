import { mkdir, readFile, writeFile } from 'node:fs/promises'

/**
 * remove device imports
 */
const path = './src/phaser/src/device/index.js'
const options = { encoding: 'utf-8' }

let file = await readFile(path, options)
file = `module.exports = { };`
await writeFile(path, file, options)

/**
 * copy the type definitions and add Phaser's MIT notice to each copy.
 * phaser.d.ts references ./matter, so both files are needed.
 */
const license = (await readFile('./src/phaser/LICENSE.md', options)).trim()
const notice = `/*!
Type definitions copied from Phaser (https://github.com/phaserjs/phaser).

${license}
*/
`

await mkdir('./dist', { recursive: true })
for (const name of ['phaser.d.ts', 'matter.d.ts']) {
  // Phaser refers to ./matter and ./phaser as types packages, which do not resolve for consumers.
  // Point those references at the copied files instead.
  const types = (await readFile(`./src/phaser/types/${name}`, options)).replace(
    /^\/\/\/ <reference types="\.\/(\w+)" \/>$/gm,
    '/// <reference path="./$1.d.ts" />'
  )
  await writeFile(`./dist/${name}`, notice + types, options)
}
