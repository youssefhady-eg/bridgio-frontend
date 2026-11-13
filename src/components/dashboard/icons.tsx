import {
  BookOpen,
  ChartColumn,
  CircleCheck,
  ClipboardList,
  Clock,
  FilePenLine,
  PanelsTopLeft,
  Pencil,
  Sparkles,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react'

/**
 * Status / section icons for the frontend-finish screens.
 *
 * Lucide is the single BRIDGIO icon source (owner decision 2026-11-13). This
 * module keeps its original API (`IconName` + `Icon`) but renders Lucide
 * components, so every caller is unchanged and the previous hand-authored
 * stroke set is gone. Status is always icon + word (token sheet §1 / §6), so
 * every chip and empty state pairs one of these with visible text.
 * `aria-hidden` is safe because the adjacent word carries the meaning.
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

const icons: Record<IconName, LucideIcon> = {
  classes: PanelsTopLeft,
  students: Users,
  tests: ClipboardList,
  drafts: FilePenLine,
  check: CircleCheck,
  pencil: Pencil,
  chart: ChartColumn,
  book: BookOpen,
  alert: TriangleAlert,
  clock: Clock,
  spark: Sparkles,
}

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 20, className }: IconProps) {
  const Glyph = icons[name]

  return (
    <Glyph
      className={className}
      size={size}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
    />
  )
}
