import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Student tests area layout.
 *
 * One test player lives at `/student/tests` and the review screen at
 * `/student/tests/$testId/results`. The layout renders only the matched child.
 */
export const Route = createFileRoute('/student/tests')({
  component: () => <Outlet />,
})