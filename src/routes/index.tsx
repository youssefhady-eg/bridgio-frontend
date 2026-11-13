import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * Role home — each role lands on its own first screen: the teacher dashboard,
 * the student tests list, the parent child progress, or the assistant's granted
 * sections. The home route never renders a screen of its own.
 */
export const Route = createFileRoute('/')({
  beforeLoad: ({ search }) => {
    if (search.as === 'student') {
      throw redirect({
        to: '/student/tests',
        search: { as: 'student', lang: search.lang },
      })
    }
    if (search.as === 'parent') {
      throw redirect({
        to: '/parent/progress',
        search: { as: 'parent', lang: search.lang },
      })
    }
    if (search.as === 'assistant') {
      throw redirect({
        to: '/assistant',
        search: { as: 'assistant', lang: search.lang },
      })
    }
    // No `?as` means the default teacher role.
    throw redirect({
      to: '/teacher/dashboard',
      search: { as: 'teacher', lang: search.lang },
    })
  },
  component: () => null,
})
