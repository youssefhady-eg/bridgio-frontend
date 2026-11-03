/**
 * PROPOSED endpoint map — Mentingo to implement on restore/rebuild.
 *
 * These paths are a proposal, not a description of existing Mentingo routes.
 * They live in one file so a backend change is a single-place edit, never a
 * screen rewrite. Base URL comes from `VITE_API_URL`.
 */

const encode = (value: string): string => encodeURIComponent(value)

export const endpoints = {
  auth: {
    session: '/auth/session',
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
  },
  teachers: {
    profile: (teacherId: string) => `/teachers/${encode(teacherId)}`,
    dashboard: (teacherId: string) =>
      `/teachers/${encode(teacherId)}/dashboard`,
  },
  students: {
    profile: (studentId: string) => `/students/${encode(studentId)}`,
    progress: (studentId: string) =>
      `/students/${encode(studentId)}/progress`,
  },
  rbac: {
    // PROPOSED — RBAC-owned grants. The frontend only reads them.
    capabilities: (userId: string) =>
      `/users/${encode(userId)}/capabilities`,
  },
  parents: {
    // PROPOSED — parent view, display only.
    profile: '/parents/me',
    overview: (childId: string) =>
      `/parents/children/${encode(childId)}/overview`,
  },
  messages: {
    // PROPOSED — in-app chat, mock only; no real-time transport claimed.
    threads: '/messages/threads',
    messages: (threadId: string) =>
      `/messages/threads/${encode(threadId)}/messages`,
  },
  classrooms: {
    forTeacher: (teacherId: string) =>
      `/teachers/${encode(teacherId)}/classrooms`,
    detail: (classroomId: string) => `/classrooms/${encode(classroomId)}`,
    students: (classroomId: string) =>
      `/classrooms/${encode(classroomId)}/students`,
  },
  curriculum: {
    subjects: '/curriculum/subjects',
    units: (subjectId: string) =>
      `/curriculum/subjects/${encode(subjectId)}/units`,
    unit: (unitId: string) => `/curriculum/units/${encode(unitId)}`,
  },
  materials: {
    forTeacher: (teacherId: string) =>
      `/teachers/${encode(teacherId)}/materials`,
    detail: (materialId: string) => `/materials/${encode(materialId)}`,
    create: '/materials',
  },
  tests: {
    forTeacher: (teacherId: string) =>
      `/teachers/${encode(teacherId)}/tests`,
    forClass: (classroomId: string) =>
      `/classrooms/${encode(classroomId)}/tests`,
    detail: (testId: string) => `/tests/${encode(testId)}`,
    createDraft: '/tests',
    publish: (testId: string) => `/tests/${encode(testId)}/publish`,
  },
  questions: {
    list: (testId: string) => `/tests/${encode(testId)}/questions`,
    // PROPOSED route for the student-safe list (no `correctOptionId`).
    studentList: (testId: string) =>
      `/tests/${encode(testId)}/student-questions`,
    detail: (testId: string, questionId: string) =>
      `/tests/${encode(testId)}/questions/${encode(questionId)}`,
    reorder: (testId: string) => `/tests/${encode(testId)}/questions/order`,
  },
  attempts: {
    forStudent: (studentId: string) =>
      `/students/${encode(studentId)}/attempts`,
    start: '/attempts',
    detail: (attemptId: string) => `/attempts/${encode(attemptId)}`,
    answer: (attemptId: string, questionId: string) =>
      `/attempts/${encode(attemptId)}/answers/${encode(questionId)}`,
    submit: (attemptId: string) => `/attempts/${encode(attemptId)}/submit`,
  },
  mohsen: {
    ask: '/mohsen/ask',
    draftQuestions: '/mohsen/draft-questions',
  },
} as const
