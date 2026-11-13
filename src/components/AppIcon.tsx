import type { SVGProps } from 'react'
import {
  BookOpen,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Globe,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MessagesSquare,
  Moon,
  School,
  Star,
  Sun,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'

/**
 * Small icon set for the refinement shell (sidebar + utility header).
 * Lucide is the single BRIDGIO icon source (owner decision 2026-11-13); icons
 * render with `strokeWidth` 1.8 and stroke uses `currentColor` so every icon
 * inherits the surrounding text colour in both themes and both directions.
 * Decorative by default: callers pass an accessible name on the surrounding
 * control, so `aria-hidden` is set here.
 */

export type AppIconName =
  | 'menu'
  | 'close'
  | 'globe'
  | 'chat'
  | 'user'
  | 'dashboard'
  | 'classes'
  | 'tests'
  | 'students'
  | 'lessons'
  | 'progress'
  | 'results'
  | 'messages'
  | 'sun'
  | 'moon'
  | 'collapse'
  | 'expand'

/**
 * AppIconName → Lucide component. Order matches the union above so the two
 * stay in sync; `chat` and `messages` are deliberately different glyphs
 * (single bubble vs double bubble).
 */
const icons: Record<AppIconName, LucideIcon> = {
  menu: Menu,
  close: X,
  globe: Globe,
  chat: MessageSquare,
  user: User,
  dashboard: LayoutDashboard,
  classes: School,
  tests: ClipboardList,
  students: Users,
  lessons: BookOpen,
  progress: ChartColumn,
  results: Star,
  messages: MessagesSquare,
  sun: Sun,
  moon: Moon,
  collapse: ChevronLeft,
  expand: ChevronRight,
}

interface AppIconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: AppIconName
  size?: number
}

export function AppIcon({ name, size = 20, ...rest }: AppIconProps) {
  const Icon = icons[name]

  return (
    <Icon
      size={size}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  )
}

/** Map a nav destination id to the closest icon. */
export function navIconName(id: string): AppIconName {
  switch (id) {
    case 'teacher-dashboard':
      return 'dashboard'
    case 'teacher-classes':
      return 'classes'
    case 'teacher-tests':
    case 'student-tests':
    case 'parent-tests':
      return 'tests'
    case 'teacher-students':
      return 'students'
    case 'student-lessons':
      return 'lessons'
    case 'student-progress':
    case 'parent-progress':
      return 'progress'
    case 'parent-results':
      return 'results'
    case 'parent-messages':
      return 'messages'
    default:
      return 'dashboard'
  }
}
