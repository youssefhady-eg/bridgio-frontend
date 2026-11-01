import type {
  Attempt,
  ClassroomId,
  CurriculumSubject,
  CurriculumUnit,
  Material,
  Question,
  QuestionOption,
  TestSource,
  UnitId,
  User,
  UserId,
} from '../types'

/**
 * Mock seed data for the BRIDGIO MVP.
 *
 * This is DEMO DATA, not product copy and not real teacher/student data.
 * All Arabic wording here is DRAFT and centralised for later replacement; it must
 * not be treated as approved final copy. No endpoint, ID or shape here is a
 * confirmed Mentingo record.
 */

export const seedIds = {
  teacher: 'usr_teacher_mona',
  studentSara: 'usr_student_sara',
  studentOmar: 'usr_student_omar',
  studentYoussef: 'usr_student_youssef',
  classMath: 'class_math_3a',
  classPhysics: 'class_physics_3b',
  subjectMath: 'subj_math_3',
  subjectPhysics: 'subj_physics_3',
  unitDerivatives: 'unit_math_derivatives',
  unitIntegration: 'unit_math_integration',
  unitMotion: 'unit_physics_motion',
  materialDerivatives: 'mat_math_deriv_notes',
  materialPhysics: 'mat_physics_motion_notes',
  testDerivatives: 'test_math_deriv_1',
  testIntegrationDraft: 'test_math_integration_draft',
  testPhysics: 'test_physics_motion_1',
} as const

/** Internal storage model. Adapter methods map these to the public contract types. */
export interface MockClassroom {
  id: ClassroomId
  teacherId: UserId
  name: string
  subjectId: string
  gradeLevel: string
  description: string | null
  certificateNote: string | null
  createdAt: string
  unitIds: UnitId[]
}

export interface MockUnitProgress {
  progressPercent: number
  lessonsCompleted: number
}

export interface MockEnrollment {
  classroomId: ClassroomId
  studentId: UserId
  progressByUnit: Record<UnitId, MockUnitProgress>
  lastActiveAt: string | null
}

export interface MockTest {
  id: string
  teacherId: UserId
  classroomId: ClassroomId
  title: string
  description: string | null
  status: 'draft' | 'published'
  source: TestSource
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface MockDatabase {
  users: User[]
  subjects: CurriculumSubject[]
  units: CurriculumUnit[]
  classrooms: MockClassroom[]
  enrollments: MockEnrollment[]
  materials: Material[]
  tests: MockTest[]
  questions: Question[]
  attempts: Attempt[]
  sessionUserId: UserId | null
}

export interface MockQuestionBankItem {
  prompt: string
  options: string[]
  correctIndex: number
  excerpt: string
}

/** Grounded draft bank. Keyed by `material:<id>` or `unit:<id>`. */
export const mockQuestionBank: Record<string, MockQuestionBankItem[]> = {
  [`material:${seedIds.materialDerivatives}`]: [
    {
      prompt: 'ما مشتقة الدالة f(x) = x²؟',
      options: ['2x', 'x', 'x³', '2'],
      correctIndex: 0,
      excerpt: 'مشتقة الدالة x^n هي n·x^(n−1).',
    },
    {
      prompt: 'ما مشتقة أي دالة ثابتة؟',
      options: ['1', '0', 'الدالة نفسها', 'لا يمكن حسابها'],
      correctIndex: 1,
      excerpt: 'مشتقة أي دالة ثابتة تساوي صفرًا.',
    },
    {
      prompt: 'أي قاعدة نستخدمها لاشتقاق حاصل ضرب دالتين؟',
      options: ['قاعدة الجمع', 'قاعدة الضرب', 'قاعدة القسمة'],
      correctIndex: 1,
      excerpt: 'عند اشتقاق حاصل ضرب دالتين نستخدم قاعدة الضرب.',
    },
    {
      prompt: 'ما هي المشتقة الثانية؟',
      options: [
        'مشتقة المشتقة الأولى',
        'مربع المشتقة الأولى',
        'تكامل المشتقة الأولى',
      ],
      correctIndex: 0,
      excerpt: 'المشتقة الثانية هي مشتقة المشتقة الأولى.',
    },
  ],
  [`unit:${seedIds.unitDerivatives}`]: [
    {
      prompt: 'ما الذي تقيسه المشتقة؟',
      options: [
        'معدل التغير اللحظي للدالة',
        'المساحة تحت المنحنى',
        'قيمة الدالة عند الصفر',
      ],
      correctIndex: 0,
      excerpt: 'المشتقة تقيس معدل التغير اللحظي للدالة.',
    },
    {
      prompt: 'ما مشتقة x^n؟',
      options: ['n·x^(n−1)', 'x^(n+1)', 'n·x^n'],
      correctIndex: 0,
      excerpt: 'مشتقة الدالة x^n هي n·x^(n−1).',
    },
  ],
  [`unit:${seedIds.unitIntegration}`]: [
    {
      prompt: 'ما العلاقة بين التكامل والاشتقاق؟',
      options: [
        'التكامل هو العملية العكسية للاشتقاق',
        'التكامل هو ضرب المشتقة في الدالة',
        'لا توجد علاقة بينهما',
      ],
      correctIndex: 0,
      excerpt: 'التكامل هو العملية العكسية للاشتقاق.',
    },
    {
      prompt: 'ما تكامل x^n بالنسبة لـ x؟',
      options: [
        'x^(n+1)/(n+1) + C',
        'n·x^(n−1) + C',
        'x^n + C',
      ],
      correctIndex: 0,
      excerpt: 'تكامل x^n هو x^(n+1)/(n+1) + C.',
    },
  ],
  [`unit:${seedIds.unitMotion}`]: [
    {
      prompt: 'كيف نحسب السرعة المتوسطة؟',
      options: [
        'الإزاحة مقسومة على الزمن',
        'الزمن مقسومًا على الإزاحة',
        'العجلة مضروبة في الزمن',
      ],
      correctIndex: 0,
      excerpt: 'السرعة المتوسطة تساوي الإزاحة مقسومة على الزمن.',
    },
    {
      prompt: 'ما العجلة؟',
      options: [
        'معدل تغير السرعة بالنسبة للزمن',
        'المسافة الكلية المقطوعة',
        'السرعة القياسية في لحظة معينة',
      ],
      correctIndex: 0,
      excerpt: 'العجلة هي معدل تغير السرعة بالنسبة للزمن.',
    },
    {
      prompt: 'أي كمية من التالي كمية متجهة؟',
      options: ['السرعة', 'الزمن', 'الكتلة'],
      correctIndex: 0,
      excerpt: 'السرعة كمية متجهة.',
    },
  ],
  [`material:${seedIds.materialPhysics}`]: [
    {
      prompt: 'ما الفرق بين السرعة والسرعة القياسية؟',
      options: [
        'السرعة كمية متجهة، والسرعة القياسية مقدار دون اتجاه',
        'لا يوجد فرق بينهما',
        'السرعة القياسية كمية متجهة أيضًا',
      ],
      correctIndex: 0,
      excerpt: 'السرعة كمية متجهة، أما السرعة القياسية فهي مقدار السرعة دون اتجاه.',
    },
  ],
}

const createdAt = '2026-10-24T09:15:00.000Z'
const updatedAt = '2026-10-30T12:40:00.000Z'
const publishedAt = '2026-10-30T12:45:00.000Z'

function option(questionId: string, index: number, text: string): QuestionOption {
  return { id: `${questionId}_opt_${index + 1}`, text }
}

function question(input: {
  id: string
  testId: string
  order: number
  prompt: string
  options: string[]
  correctIndex: number
  grounding: Question['grounding']
  origin: Question['origin']
  at?: string
}): Question {
  return {
    id: input.id,
    testId: input.testId,
    order: input.order,
    prompt: input.prompt,
    options: input.options.map((text, index) =>
      option(input.id, index, text),
    ),
    correctOptionId: `${input.id}_opt_${input.correctIndex + 1}`,
    grounding: input.grounding,
    origin: input.origin,
    createdAt: input.at ?? createdAt,
    updatedAt: input.at ?? updatedAt,
  }
}

export function createSeedDatabase(options: {
  scenario: 'seeded' | 'empty'
  session: 'teacher' | 'student' | 'none'
}): MockDatabase {
  const users: User[] = [
    {
      id: seedIds.teacher,
      role: 'teacher',
      displayName: 'أ. منى عبد الرحمن',
      email: 'mona.teacher@bridgio.test',
      avatarUrl: null,
    },
    {
      id: seedIds.studentSara,
      role: 'student',
      displayName: 'سارة محمد',
      email: 'sara.student@bridgio.test',
      avatarUrl: null,
    },
    {
      id: seedIds.studentOmar,
      role: 'student',
      displayName: 'عمر خالد',
      email: 'omar.student@bridgio.test',
      avatarUrl: null,
    },
    {
      id: seedIds.studentYoussef,
      role: 'student',
      displayName: 'يوسف علي',
      email: 'youssef.student@bridgio.test',
      avatarUrl: null,
    },
  ]

  const subjects: CurriculumSubject[] = [
    {
      id: seedIds.subjectMath,
      name: 'الرياضيات',
      gradeLevel: 'الصف الثالث الثانوي',
      unitCount: 2,
    },
    {
      id: seedIds.subjectPhysics,
      name: 'الفيزياء',
      gradeLevel: 'الصف الثالث الثانوي',
      unitCount: 1,
    },
  ]

  const units: CurriculumUnit[] = [
    {
      id: seedIds.unitDerivatives,
      subjectId: seedIds.subjectMath,
      subjectName: 'الرياضيات',
      title: 'التفاضل: المشتقات',
      description:
        'تعريف المشتقة وقواعد الاشتقاق وتطبيقاتها. المشتقة تقيس معدل التغير اللحظي للدالة. مشتقة الدالة x^n هي n·x^(n−1). مشتقة أي دالة ثابتة تساوي صفرًا. عند اشتقاق حاصل ضرب دالتين نستخدم قاعدة الضرب.',
      order: 1,
      lessonCount: 4,
    },
    {
      id: seedIds.unitIntegration,
      subjectId: seedIds.subjectMath,
      subjectName: 'الرياضيات',
      title: 'التكامل',
      description:
        'التكامل هو العملية العكسية للاشتقاق. تكامل x^n هو x^(n+1)/(n+1) + C. التكامل المحدد يحسب المساحة تحت المنحنى.',
      order: 2,
      lessonCount: 3,
    },
    {
      id: seedIds.unitMotion,
      subjectId: seedIds.subjectPhysics,
      subjectName: 'الفيزياء',
      title: 'الحركة في خط مستقيم',
      description:
        'السرعة المتوسطة تساوي الإزاحة مقسومة على الزمن. السرعة كمية متجهة، أما السرعة القياسية فهي مقدار السرعة دون اتجاه. العجلة هي معدل تغير السرعة بالنسبة للزمن. في الحركة بعجلة ثابتة نستخدم معادلات الحركة الثلاث.',
      order: 1,
      lessonCount: 4,
    },
  ]

  const classrooms: MockClassroom[] = [
    {
      id: seedIds.classMath,
      teacherId: seedIds.teacher,
      name: 'الصف الثالث الثانوي — أ',
      subjectId: seedIds.subjectMath,
      gradeLevel: 'الصف الثالث الثانوي',
      description: 'فصل الرياضيات — مراجعة التفاضل والتكامل.',
      certificateNote: null,
      createdAt,
      unitIds: [seedIds.unitDerivatives, seedIds.unitIntegration],
    },
    {
      id: seedIds.classPhysics,
      teacherId: seedIds.teacher,
      name: 'الصف الثالث الثانوي — ب',
      subjectId: seedIds.subjectPhysics,
      gradeLevel: 'الصف الثالث الثانوي',
      description: 'فصل الفيزياء — الحركة في خط مستقيم.',
      certificateNote: null,
      createdAt,
      unitIds: [seedIds.unitMotion],
    },
  ]

  if (options.scenario === 'empty') {
    return {
      users,
      subjects,
      units,
      classrooms: [],
      enrollments: [],
      materials: [],
      tests: [],
      questions: [],
      attempts: [],
      sessionUserId:
        options.session === 'teacher'
          ? seedIds.teacher
          : options.session === 'student'
            ? seedIds.studentSara
            : null,
    }
  }

  const materials: Material[] = [
    {
      id: seedIds.materialDerivatives,
      teacherId: seedIds.teacher,
      classroomId: seedIds.classMath,
      unitId: seedIds.unitDerivatives,
      title: 'مذكرة التفاضل — قواعد الاشتقاق',
      kind: 'text',
      status: 'ready',
      textContent:
        'المشتقة تقيس معدل التغير اللحظي للدالة. مشتقة الدالة x^n هي n·x^(n−1). مشتقة أي دالة ثابتة تساوي صفرًا. عند اشتقاق حاصل ضرب دالتين نستخدم قاعدة الضرب: (f·g)′ = f′·g + f·g′. عند اشتقاق خارج قسمة دالتين نستخدم قاعدة القسمة. المشتقة الثانية هي مشتقة المشتقة الأولى.',
      sourceUrl: null,
      wordCount: 43,
      createdAt,
    },
    {
      id: seedIds.materialPhysics,
      teacherId: seedIds.teacher,
      classroomId: seedIds.classPhysics,
      unitId: seedIds.unitMotion,
      title: 'مذكرة الفيزياء — الحركة',
      kind: 'text',
      status: 'ready',
      textContent:
        'السرعة المتوسطة تساوي الإزاحة مقسومة على الزمن. السرعة كمية متجهة، أما السرعة القياسية فهي مقدار السرعة دون اتجاه. العجلة هي معدل تغير السرعة بالنسبة للزمن. في الحركة بعجلة ثابتة نستخدم معادلات الحركة الثلاث.',
      sourceUrl: null,
      wordCount: 34,
      createdAt,
    },
  ]

  const tests: MockTest[] = [
    {
      id: seedIds.testDerivatives,
      teacherId: seedIds.teacher,
      classroomId: seedIds.classMath,
      title: 'اختبار قواعد الاشتقاق',
      description: 'اختبار قصير على قواعد الاشتقاق الأساسية.',
      status: 'published',
      source: {
        kind: 'material',
        materialId: seedIds.materialDerivatives,
        unitId: seedIds.unitDerivatives,
        label: 'مذكرة التفاضل — قواعد الاشتقاق',
      },
      createdAt,
      updatedAt,
      publishedAt,
    },
    {
      id: seedIds.testIntegrationDraft,
      teacherId: seedIds.teacher,
      classroomId: seedIds.classMath,
      title: 'مراجعة التكامل',
      description: null,
      status: 'draft',
      source: {
        kind: 'curriculum_unit',
        materialId: null,
        unitId: seedIds.unitIntegration,
        label: 'التكامل',
      },
      createdAt: updatedAt,
      updatedAt,
      publishedAt: null,
    },
    {
      id: seedIds.testPhysics,
      teacherId: seedIds.teacher,
      classroomId: seedIds.classPhysics,
      title: 'اختبار الحركة — الوحدة الأولى',
      description: 'اختبار على مفاهيم السرعة والعجلة.',
      status: 'published',
      source: {
        kind: 'material',
        materialId: seedIds.materialPhysics,
        unitId: seedIds.unitMotion,
        label: 'مذكرة الفيزياء — الحركة',
      },
      createdAt,
      updatedAt,
      publishedAt,
    },
  ]

  const derivativesGrounding: Question['grounding'] = [
    {
      kind: 'material',
      materialId: seedIds.materialDerivatives,
      unitId: seedIds.unitDerivatives,
      label: 'مذكرة التفاضل — قواعد الاشتقاق',
      excerpt: 'مشتقة الدالة x^n هي n·x^(n−1).',
    },
  ]

  const physicsGrounding: Question['grounding'] = [
    {
      kind: 'material',
      materialId: seedIds.materialPhysics,
      unitId: seedIds.unitMotion,
      label: 'مذكرة الفيزياء — الحركة',
      excerpt: 'السرعة المتوسطة تساوي الإزاحة مقسومة على الزمن.',
    },
  ]

  const integrationGrounding: Question['grounding'] = [
    {
      kind: 'curriculum_unit',
      materialId: null,
      unitId: seedIds.unitIntegration,
      label: 'التكامل',
      excerpt: 'التكامل هو العملية العكسية للاشتقاق.',
    },
  ]

  const questions: Question[] = [
    question({
      id: 'q_deriv_1',
      testId: seedIds.testDerivatives,
      order: 1,
      prompt: 'ما مشتقة الدالة f(x) = x²؟',
      options: ['2x', 'x', 'x³', '2'],
      correctIndex: 0,
      grounding: derivativesGrounding,
      origin: 'mohsen',
    }),
    question({
      id: 'q_deriv_2',
      testId: seedIds.testDerivatives,
      order: 2,
      prompt: 'ما مشتقة أي دالة ثابتة؟',
      options: ['1', '0', 'الدالة نفسها', 'لا يمكن حسابها'],
      correctIndex: 1,
      grounding: derivativesGrounding,
      origin: 'mohsen',
    }),
    question({
      id: 'q_deriv_3',
      testId: seedIds.testDerivatives,
      order: 3,
      prompt: 'أي قاعدة نستخدمها لاشتقاق حاصل ضرب دالتين؟',
      options: ['قاعدة الجمع', 'قاعدة الضرب', 'قاعدة القسمة'],
      correctIndex: 1,
      grounding: [],
      origin: 'teacher',
    }),
    question({
      id: 'q_integration_1',
      testId: seedIds.testIntegrationDraft,
      order: 1,
      prompt: 'ما العلاقة بين التكامل والاشتقاق؟',
      options: [
        'التكامل هو العملية العكسية للاشتقاق',
        'التكامل هو ضرب المشتقة في الدالة',
        'لا توجد علاقة بينهما',
      ],
      correctIndex: 0,
      grounding: integrationGrounding,
      origin: 'mohsen',
    }),
    question({
      id: 'q_physics_1',
      testId: seedIds.testPhysics,
      order: 1,
      prompt: 'كيف نحسب السرعة المتوسطة؟',
      options: [
        'الإزاحة مقسومة على الزمن',
        'الزمن مقسومًا على الإزاحة',
        'العجلة مضروبة في الزمن',
      ],
      correctIndex: 0,
      grounding: physicsGrounding,
      origin: 'mohsen',
    }),
    question({
      id: 'q_physics_2',
      testId: seedIds.testPhysics,
      order: 2,
      prompt: 'ما العجلة؟',
      options: [
        'معدل تغير السرعة بالنسبة للزمن',
        'المسافة الكلية المقطوعة',
        'السرعة القياسية في لحظة معينة',
      ],
      correctIndex: 0,
      grounding: physicsGrounding,
      origin: 'mohsen',
    }),
  ]

  const enrollments: MockEnrollment[] = [
    {
      classroomId: seedIds.classMath,
      studentId: seedIds.studentSara,
      progressByUnit: {
        [seedIds.unitDerivatives]: { progressPercent: 64, lessonsCompleted: 3 },
        [seedIds.unitIntegration]: { progressPercent: 20, lessonsCompleted: 1 },
      },
      lastActiveAt: '2026-10-31T18:20:00.000Z',
    },
    {
      classroomId: seedIds.classMath,
      studentId: seedIds.studentOmar,
      progressByUnit: {
        [seedIds.unitDerivatives]: { progressPercent: 35, lessonsCompleted: 1 },
        [seedIds.unitIntegration]: { progressPercent: 0, lessonsCompleted: 0 },
      },
      lastActiveAt: '2026-10-29T08:05:00.000Z',
    },
    {
      classroomId: seedIds.classPhysics,
      studentId: seedIds.studentYoussef,
      progressByUnit: {
        [seedIds.unitMotion]: { progressPercent: 50, lessonsCompleted: 2 },
      },
      lastActiveAt: '2026-10-30T20:10:00.000Z',
    },
  ]

  const findQuestionIds = (testId: string) =>
    questions
      .filter((item) => item.testId === testId)
      .sort((a, b) => a.order - b.order)

  const saraAttemptQuestions = findQuestionIds(seedIds.testDerivatives)
  const saraAnswers = saraAttemptQuestions.map((item, index) => ({
    questionId: item.id,
    optionId: index === 0 ? (item.options[0]?.id ?? null) : null,
    answeredAt: index === 0 ? '2026-10-31T18:20:00.000Z' : null,
  }))

  const omarAttemptQuestions = findQuestionIds(seedIds.testDerivatives)
  const omarAnswers = omarAttemptQuestions.map((item) => ({
    questionId: item.id,
    optionId: item.options[0]?.id ?? null,
    answeredAt: '2026-10-29T08:05:00.000Z',
  }))

  const youssefAttemptQuestions = findQuestionIds(seedIds.testPhysics)
  const youssefAnswers = youssefAttemptQuestions.map((item) => ({
    questionId: item.id,
    optionId: null,
    answeredAt: null,
  }))

  const attempts: Attempt[] = [
    {
      id: 'attempt_sara_deriv',
      testId: seedIds.testDerivatives,
      testTitle: 'اختبار قواعد الاشتقاق',
      classroomId: seedIds.classMath,
      classroomName: 'الصف الثالث الثانوي — أ',
      studentId: seedIds.studentSara,
      status: 'in_progress',
      answeredCount: saraAnswers.filter((answer) => answer.optionId !== null).length,
      questionCount: saraAttemptQuestions.length,
      answers: saraAnswers,
      startedAt: '2026-10-31T18:10:00.000Z',
      submittedAt: null,
    },
    {
      id: 'attempt_omar_deriv',
      testId: seedIds.testDerivatives,
      testTitle: 'اختبار قواعد الاشتقاق',
      classroomId: seedIds.classMath,
      classroomName: 'الصف الثالث الثانوي — أ',
      studentId: seedIds.studentOmar,
      status: 'submitted',
      answeredCount: omarAnswers.length,
      questionCount: omarAttemptQuestions.length,
      answers: omarAnswers,
      startedAt: '2026-10-29T07:55:00.000Z',
      submittedAt: '2026-10-29T08:05:00.000Z',
    },
    {
      id: 'attempt_youssef_physics',
      testId: seedIds.testPhysics,
      testTitle: 'اختبار الحركة — الوحدة الأولى',
      classroomId: seedIds.classPhysics,
      classroomName: 'الصف الثالث الثانوي — ب',
      studentId: seedIds.studentYoussef,
      status: 'in_progress',
      answeredCount: 0,
      questionCount: youssefAttemptQuestions.length,
      answers: youssefAnswers,
      startedAt: '2026-10-30T20:10:00.000Z',
      submittedAt: null,
    },
  ]

  return {
    users,
    subjects,
    units,
    classrooms,
    enrollments,
    materials,
    tests,
    questions,
    attempts,
    sessionUserId:
      options.session === 'teacher'
        ? seedIds.teacher
        : options.session === 'student'
          ? seedIds.studentSara
          : null,
  }
}
