import type { SVGProps } from 'react'

/**
 * Small inline icon set for the refinement shell (sidebar + utility header).
 * Stroke uses `currentColor` so every icon inherits the surrounding text colour
 * in both themes and both directions. Decorative by default: callers pass an
 * accessible name on the surrounding control, so `aria-hidden` is set here.
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

const paths: Record<AppIconName, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  globe:
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.2 4 5.4 4 9s-1.5 6.8-4 9c-2.5-2.2-4-5.4-4-9s1.5-6.8 4-9ZM3.5 9h17M3.5 15h17',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  dashboard: 'M4 4h7v7H4V4Zm9 0h7v4h-7V4ZM4 13h7v7H4v-7Zm9 3h7v4h-7v-4Z',
  classes: 'M4 5h16v13H4V5Zm0 4h16M8 5v4',
  tests: 'M7 4h10v16H7V4Zm2 4h6M9 12h6M9 16h4',
  students:
    'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 19a6 6 0 0 1 12 0M15 14.5A5 5 0 0 1 21 19',
  lessons: 'M12 6.5C10.5 5 8 4.5 5 5v13c3-.5 5.5 0 7 1.5 1.5-1.5 4-2 7-1.5V5c-3-.5-5.5 0-7 1.5Zm0 0V19.5',
  progress: 'M4 20V9m5 11V4m5 16v-7m5 7V7',
  results:
    'M12 4l2.1 4.3 4.7.7-3.4 3.3.8 4.7L12 15l-4.2 2.2.8-4.7L5.2 9l4.7-.7L12 4Z',
  messages: 'M4 5h16v11H9l-5 4V5Z',
}

interface AppIconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: AppIconName
  size?: number
}

export function AppIcon({ name, size = 20, ...rest }: AppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
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
