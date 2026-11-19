import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { build } from 'esbuild'

/**
 * Bundles the library into dist/arcade-physics.min.js.
 *
 * Every third-party file in the bundle is looked up through esbuild's metafile.
 * For each package that contributes code, the build reads that package's LICENSE
 * file and writes it into a banner at the top of the bundle. The build fails if a
 * package has no license file, so a missing notice cannot ship silently.
 */

const LICENSE_FILE_NAMES = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license', 'license.md']

// Code copied into another package's source tree. There is no package.json or
// LICENSE file for these, so they are mapped to their license text by hand.
const COPIED_CODE = {
  'src/phaser/src/structs/RTree.js': { name: 'rbush (forked in src/phaser/src/structs/RTree.js)', license: 'scripts/licenses/rbush.txt' }
}

const options = {
  entryPoints: ['src/ArcadePhysics.mjs'],
  bundle: true,
  minify: true,
  format: 'esm'
}
// dist/index.js is the package entry (`main` in package.json).
// dist/arcade-physics.min.js is the same code for the demo pages and the Pages deploy.
const outputs = [
  { outfile: 'dist/index.js' },
  { outfile: 'dist/arcade-physics.min.js', sourcemap: true }
]

/** Returns the package directory an input file belongs to, or null for project code. */
function packageRootOf(input) {
  if (input.startsWith('src/phaser/')) return 'src/phaser'
  const match = input.match(/^(node_modules\/(?:@[^/]+\/)?[^/]+)\//)
  return match ? match[1] : null
}

async function readLicenseOf(root) {
  const file = LICENSE_FILE_NAMES.map(name => join(root, name)).find(existsSync)
  if (!file) throw new Error(`No license file found for ${root}. Add one before bundling.`)
  return (await readFile(file, 'utf-8')).trim()
}

async function nameOf(root) {
  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf-8'))
  return pkg.name ?? root
}

async function buildBanner(inputs) {
  const sections = new Map()

  for (const input of inputs) {
    if (COPIED_CODE[input]) {
      const { name, license } = COPIED_CODE[input]
      if (!sections.has(name)) {
        sections.set(name, await readFile(license, 'utf-8').then(text => text.trim()))
      }
      continue
    }

    const root = packageRootOf(input)
    if (!root) {
      if (input.startsWith('src/')) continue // project code, covered by the root LICENSE
      throw new Error(`Cannot determine the origin of bundled file: ${input}`)
    }

    const name = await nameOf(root)
    if (!sections.has(name)) {
      sections.set(name, await readLicenseOf(root))
    }
  }

  const body = [...sections.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, text]) => `--- ${name} ---\n\n${text}`)
    .join('\n\n')

  return `/*!
Third-party notices. This file bundles the following MIT licensed code.

${body}
*/`
}

// First pass: find every bundled input file without writing output.
const probe = await build({ ...options, outfile: outputs[0].outfile, write: false, metafile: true })
const banner = await buildBanner(Object.keys(probe.metafile.inputs))

// Second pass: write each bundle with the generated notices as its banner.
for (const output of outputs) {
  await build({ ...options, ...output, banner: { js: banner } })
}
