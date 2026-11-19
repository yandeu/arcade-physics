import { writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import ts from 'typescript'

/**
 * Generates type declarations for the public API into dist/.
 *
 * Only the files listed in `entries` are checked and written. Phaser's own
 * JavaScript sources are imported by these files, but errors in them are not
 * reported here and their declarations are not written.
 */
const entries = ['src/ArcadePhysics.mjs', 'src/ArcadeTilemap.mjs']
const outDir = 'dist'

const options = {
  allowJs: true,
  checkJs: true,
  declaration: true,
  emitDeclarationOnly: true,
  skipLibCheck: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  rootDir: 'src',
  outDir
}

const ownFiles = new Set(entries.map(file => resolve(file)))
const program = ts.createProgram(entries, options)

const diagnostics = ts
  .getPreEmitDiagnostics(program)
  .filter(d => d.file && ownFiles.has(resolve(d.file.fileName)))

if (diagnostics.length > 0) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: f => f,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => '\n'
    })
  )
  throw new Error(`Type errors in ${diagnostics.length} place(s). Declarations were not written.`)
}

const allowed = new Set(entries.map(file => basename(file).replace(/\.mjs$/, '.d.mts')))
const written = []

program.emit(
  undefined,
  (fileName, text, _bom, _onError, sourceFiles) => {
    const isOwn = allowed.has(basename(fileName)) && sourceFiles?.some(sf => ownFiles.has(resolve(sf.fileName)))
    if (!isOwn) return
    // Drop triple-slash references. They point at src/ and are not shipped.
    const cleaned = text.replace(/^\/\/\/ <reference path=.*\/>\n?/gm, '')
    writeFileSync(fileName, cleaned, 'utf-8')
    written.push(fileName)
  },
  undefined,
  true
)

// Entry for consumers. It matches the runtime exports of dist/index.js.
const index = `/// <reference path="./phaser.d.ts" />
export * from './ArcadePhysics.mjs'
`
writeFileSync(`${outDir}/index.d.ts`, index, 'utf-8')

console.log(['Wrote:', ...written, `${outDir}/index.d.ts`].join('\n  '))
