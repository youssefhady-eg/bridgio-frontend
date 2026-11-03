/**
 * Inline status / section icons for the teacher dashboard.
 *
 * Small hand-authored SVG strokes — no icon font, no paid icon set, no image
 * asset. Status is always icon + word (token sheet §1 / §6), so every chip and
 * empty state pairs one of these with visible text. `aria-hidden` is safe
 * because the adjacent word carries the meaning.
 */

export type IconName =
  | 'classes'
  | 'students'
  | 'tests'
  | 'drafts'
  | 'check'
  | 'pencil'
  | 'chart'
  | 'book'
  | 'alert'
  | 'clock'
  | 'spark'

const paths: Record<IconName, string[]> = {
  classes: [
    'M4 5.5A1.5 1.5 0 0 1 5.5 4H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 18.5Z',
    'M4 8h16',
    'M8 4v16',
  ],
  students: [
    'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19',
    'M10 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M17 11a2.5 2.5 0 1 0 0-5',
    'M20 19v-1a3 3 0 0 0-2-2.8',
  ],
  tests: [
    'M7 3.5h8.5L19 7v13.5H7Z',
    'M15 3.5V7h4',
    'M10 11h6',
    'M10 14.5h6',
    'M10 18h4',
  ],
  drafts: [
    'M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10Z',
    'M14 6.5l3 3',
  ],
  check: [
    'M20 11.2V12a8 8 0 1 1-4.7-7.3',
    'M20 5l-8.5 8.5-2.5-2.5',
  ],
  pencil: [
    'M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10Z',
    'M14 6.5l3 3',
  ],
  chart: [
    'M4 20V4',
    'M4 20h16',
    'M8 16v-5',
    'M12.5 16V8',
    'M17 16v-3',
  ],
  book: [
    'M5 4.5h9A2.5 2.5 0 0 1 16.5 7v13H7.5A2.5 2.5 0 0 1 5 17.5Z',
    'M5 17.5A2.5 2.5 0 0 1 7.5 15h9',
    'M9 8h4',
  ],
  alert: [
    'M12 4l8.5 15h-17Z',
    'M12 9.5V14',
    'M12 17h.01',
  ],
  clock: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    'M12 7.5V12l3 2',
  ],
  spark: [
    'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z',
    'M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z',
  ],
}

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}
