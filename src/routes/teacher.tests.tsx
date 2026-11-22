import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Teacher tests area layout.
 *
 * The path is shared by three screens: the test list at `/teacher/tests`, the
 * builder at `/teacher/tests/new` and one test's detail at
 * `/teacher/tests/$testId`. The static `new` segment wins over the dynamic
 * `$testId`, and the layout renders only the matched child, so the list never
 * appears behind the builder or the detail screen.
 */
export const Route = createFileRoute('/teacher/tests')({
  component: () => <Outlet />,
})