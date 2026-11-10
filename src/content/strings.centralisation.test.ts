import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ar, assistant, brand, en } from './strings'

/**
 * Stage 6 guard: UI copy lives in this central file, not in components/routes.
 *
 * The scan covers the rendering tree only. Test fixtures and the mock adapter's
 * seed / refusal data are demo content by design, not UI chrome, so they are
 * intentionally outside this guard.
 */

// Arabic letters only: Arabic-Indic digits (٣) and the percent sign (٪) are
// formatting output, not translatable copy.
const ARABIC = /[\u0621-\u064A]/

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    if (!/\.(ts|tsx)$/.test(entry)) return []
    if (entry.includes('.test.')) return []
    return [path]
  })
}

describe('centralised UI strings', () => {
  it('has no Arabic copy hard-coded in components or routes', () => {
    const roots = ['src/components', 'src/routes']
    const offenders = roots
      .flatMap(sourceFiles)
      .filter((path) => ARABIC.test(readFileSync(path, 'utf8')))

    expect(offenders).toEqual([])
  })

  it('labels the parent role apart from every section heading', () => {
    // Regression: the parent frame rendered the same string as the eyebrow and
    // the H1, duplicating the heading on every parent section.
    for (const copy of [ar.parent, en.parent]) {
      const headings = [
        copy.progress.heading,
        copy.tests.heading,
        copy.results.heading,
        copy.messages.heading,
      ]
      expect(copy.badge.length).toBeGreaterThan(0)
      expect(headings).not.toContain(copy.badge)
    }
  })

  it('builds every named mention from the two working-name swap points', () => {
    expect(brand.name.length).toBeGreaterThan(0)
    expect(assistant.nameAr.length).toBeGreaterThan(0)

    expect(ar.head.title).toContain(brand.name)
    expect(ar.footer.note).toContain(brand.name)
    expect(ar.footer.note).toContain(assistant.nameAr)
    expect(ar.builder.draft.heading).toContain(assistant.nameAr)
    expect(ar.player.mohsen.heading).toContain(assistant.nameAr)
  })
})