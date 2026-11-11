import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Teacher classes area layout.
 *
 * The path is shared by two screens: the class list at `/teacher/classes` and
 * one class's detail at `/teacher/classes/$classId`. The layout renders only the
 * matched child, so the list never appears behind the detail screen.
 */
export const Route = createFileRoute('/teacher/classes')({
  component: () => <Outlet />,
})