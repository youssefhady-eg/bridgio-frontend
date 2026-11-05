import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Text tokens are alpha colours, so contrast must be measured after blending
 * them over the surface they sit on, not against the raw maroon.
 */
const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')

function token(name: string): string {
  const match = new RegExp(`${name}:\\s*([^;]+);`).exec(css)
  if (!match?.[1]) throw new Error(`token ${name} not found`)
  return match[1].trim()
}

type Rgb = [number, number, number]

function parse(value: string): { rgb: Rgb; alpha: number } {
  const hex = /^#([0-9a-f]{6})/i.exec(value)
  if (hex?.[1]) {
    const n = parseInt(hex[1], 16)
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], alpha: 1 }
  }
  const rgba = /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/.exec(value)
  if (!rgba) throw new Error(`cannot parse ${value}`)
  return {
    rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])],
    alpha: rgba[4] === undefined ? 1 : Number(rgba[4]),
  }
}

function blend(fg: string, bg: string): Rgb {
  const f = parse(fg)
  const b = parse(bg).rgb
  return [0, 1, 2].map((i) => f.rgb[i]! * f.alpha + b[i]! * (1 - f.alpha)) as Rgb
}

function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(fg: string, bg: string): number {
  const a = luminance(blend(fg, bg))
  const b = luminance(parse(bg).rgb)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

describe('text tokens meet WCAG AA (4.5:1) on both surfaces', () => {
  for (const surface of ['--bridgio-cream', '--bridgio-paper']) {
    for (const text of ['--text-secondary', '--text-muted']) {
      it(`${text} on ${surface}`, () => {
        expect(contrast(token(text), token(surface))).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})
