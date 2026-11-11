import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Teacher tests area layout.
 *
 * The path is shared by two screens: the builder at `/teacher/tests` and one
 * test's detail at `/teacher/tests/$testId`. The layout renders only the
 * matched child, so the builder never appears behind the detail screen.
 */
export const Route = createFileRoute('/teacher/tests')({
  component: () => <Outlet />,
})