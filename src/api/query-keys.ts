import type {
  ClassroomId,
  MaterialId,
  QuestionId,
  TestId,
  UserId,
} from './types'

/**
 * TanStack Query key factory for the single API layer.
 *
 * Screens must import keys from here instead of inventing string keys, so cache
 * invalidation stays consistent between the mock and the real adapter.
 */
export const queryKeys = {
  system: {
    info: () => ['system', 'info'] as const,
  },
  auth: {
    session: () => ['auth', 'session'] as const,
  },
  teachers: {
    all: () => ['teachers'] as const,
    profile: (teacherId: UserId) =>
      ['teachers', teacherId, 'profile'] as const,
    dashboard: (teacherId: UserId) =>
      ['teachers', teacherId, 'dashboard'] as const,
  },
  students: {
    all: () => ['students'] as const,
    profile: (studentId: UserId) =>
      ['students', studentId, 'profile'] as const,
    progress: (studentId: UserId, classroomId?: ClassroomId) =>
      ['students', studentId, 'progress', classroomId ?? 'all'] as const,
  },
  rbac: {
    all: () => ['rbac'] as const,
    capabilities: (userId: UserId) =>
      ['rbac', userId, 'capabilities'] as const,
  },
  parents: {
    all: () => ['parents'] as const,
    profile: () => ['parents', 'profile'] as const,
    overview: (childId: UserId) => ['parents', 'children', childId] as const,
  },
  messages: {
    all: () => ['messages'] as const,
    threads: () => ['messages', 'threads'] as const,
    thread: (threadId: string) => ['messages', 'threads', threadId] as const,
  },
  classrooms: {
    all: () => ['classrooms'] as const,
    forTeacher: (teacherId: UserId) =>
      ['classrooms', 'teacher', teacherId] as const,
    detail: (classroomId: ClassroomId) =>
      ['classrooms', classroomId] as const,
    students: (classroomId: ClassroomId) =>
      ['classrooms', classroomId, 'students'] as const,
  },
  curriculum: {
    all: () => ['curriculum'] as const,
    subjects: (gradeLevel?: string) =>
      ['curriculum', 'subjects', gradeLevel ?? 'all'] as const,
    units: (subjectId: string) =>
      ['curriculum', 'subjects', subjectId, 'units'] as const,
    unit: (unitId: string) => ['curriculum', 'units', unitId] as const,
  },
  materials: {
    all: () => ['materials'] as const,
    forTeacher: (teacherId: UserId, classroomId?: ClassroomId) =>
      ['materials', 'teacher', teacherId, classroomId ?? 'all'] as const,
    detail: (materialId: MaterialId) =>
      ['materials', materialId] as const,
  },
  tests: {
    all: () => ['tests'] as const,
    forTeacher: (teacherId: UserId) =>
      ['tests', 'teacher', teacherId] as const,
    forClass: (classroomId: ClassroomId) =>
      ['tests', 'classroom', classroomId] as const,
    detail: (testId: TestId) => ['tests', testId] as const,
    questions: (testId: TestId) => ['tests', testId, 'questions'] as const,
    // Separate key on purpose: the student player must never read cached full
    // questions (which carry `correctOptionId`) that the teacher builder loaded.
    studentQuestions: (testId: TestId) =>
      ['tests', testId, 'student-questions'] as const,
    question: (testId: TestId, questionId: QuestionId) =>
      ['tests', testId, 'questions', questionId] as const,
  },
  attempts: {
    all: () => ['attempts'] as const,
    forStudent: (studentId: UserId) =>
      ['attempts', 'student', studentId] as const,
    detail: (attemptId: string) => ['attempts', attemptId] as const,
  },
  mohsen: {
    all: () => ['mohsen'] as const,
  },
}
