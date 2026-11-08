import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ar, en } from '~/content/strings'

// Owner decision: Bridgio ships a light theme only — no dark theme, no toggle.
const stylesDir = join(__dirname)
const css = readdirSync(stylesDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(stylesDir, f), 'utf8'))
  .join('\n')

describe('light theme only', () => {
  it('ships no dark theme selectors or dark colour scheme', () => {
    expect(css).not.toMatch(/data-theme\s*=\s*['"]?dark/)
    expect(css).not.toMatch(/prefers-color-scheme:\s*dark/)
    expect(css).not.toMatch(/color-scheme:\s*dark/)
  })

  it('has no theme toggle copy in either language', () => {
    expect(JSON.stringify({ ar, en })).not.toMatch(/themeTo(Dark|Light)/)
  })
})
