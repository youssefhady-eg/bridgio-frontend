import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Teacher students area layout.
 *
 * The path is shared by two screens: the student list at `/teacher/students`
 * and one student's detail at `/teacher/students/$studentId`. The layout
 * renders only the matched child.
 */
export const Route = createFileRoute('/teacher/students')({
  component: () => <Outlet />,
})