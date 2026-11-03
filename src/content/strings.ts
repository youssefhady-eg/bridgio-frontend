/**
 * CENTRALISED UI STRINGS — Stage 1 shell.
 *
 * Arabic wording here is DRAFT, awaiting owner / Arabic reviewer approval.
 * It is deliberately kept in one file so it can be replaced without touching
 * components. Brand and assistant names are working names and live here so a
 * rename is a swap, not a rebuild.
 *
 * Voice rules (token sheet §6 / LIVE_RULES §4):
 *  - teacher-facing copy: MSA formal
 *  - student-facing copy: Egyptian casual Arabic
 *  - running text keeps Latin "Bridgio"; the logo itself is artwork, never retyped.
 *
 * The wordmark is artwork and is never retyped in a font; `wordmarkText` is for
 * documentation / alt text only and must not be rendered as the logo text.
 */

export const brand = {
  /** Running-text name. */
  name: 'Bridgio',
  /** Logo lettering is artwork; this string is only for alt text / docs. */
  wordmarkText: 'BRIDGIO',
} as const

export const assistant = {
  name: 'Mohsen',
  nameAr: 'محسن',
} as const

/** Screen route/page identifiers shared with src/shell/nav.ts. */
export type ScreenId =
  | 'shell-home'
  | 'teacher-dashboard'
  | 'teacher-classes'
  | 'teacher-tests'
  | 'teacher-students'
  | 'student-tests'
  | 'student-lessons'
  | 'student-progress'

/** DRAFT Arabic — not approved final copy. */
export const ar = {
  head: {
    title: 'Bridgio — المرحلة ٢: لوحة المعلم',
    description:
      'لوحة المعلم في Bridgio: الصفوف وآخر الاختبارات وتقدّم الطلاب في شاشة واحدة، بتخطيط عربي كامل من اليمين إلى اليسار. البيانات تجريبية وتأتي عبر طبقة البيانات، وهذه نسخة داخلية للتحقق وليست نسخة منتج نهائية.',
  },
  stageBanner: {
    stage: 'المرحلة ٢ من ٧',
    note: 'بناء داخلي للتحقق من لوحة المعلم. البيانات تجريبية وتأتي عبر طبقة البيانات، وليست بيانات حقيقية.',
  },
  header: {
    navLabel: 'التنقّل الرئيس',
    lockupAlt: 'شعار Bridgio الكامل (الشخصية والاسم معًا).',
    wordmarkAlt: 'اسم Bridgio النصي المعتمد.',
    roleGroupAria: 'معاينة الدور — حالة واجهة فقط، دون تسجيل دخول.',
    roleHint: 'دور المعاينة:',
    roleTeacher: 'المعلم',
    roleStudent: 'الطالب',
    skipToMain: 'تخطَّ إلى المحتوى',
  },
  /** Nav item labels — teacher copy is MSA formal, student copy is Egyptian casual. */
  nav: {
    'teacher-dashboard': 'لوحة التحكم',
    'teacher-classes': 'صفوفي',
    'teacher-tests': 'الاختبارات',
    'teacher-students': 'الطلاب',
    'student-tests': 'اختباراتي',
    'student-lessons': 'دروسي',
    'student-progress': 'تقدمي',
  } as Record<
    | 'teacher-dashboard'
    | 'teacher-classes'
    | 'teacher-tests'
    | 'teacher-students'
    | 'student-tests'
    | 'student-lessons'
    | 'student-progress',
    string
  >,
  footer: {
    note: 'Bridgio وMohsen اسمان عملان قابلان للتغيير، وصياغة العربية مسودات بانتظار المراجعة.',
    noteEn: 'Bridgio — internal build for brand verification. Not final, nothing external-facing.',
  },
  shell: {
    home: {
      badge: 'الهيكل والعلامة',
      title: 'هيكل التطبيق: الألوان، الخطوط، التخطيط',
      lead:
        'هذه شاشة إرشادية للهيكل فقط. لوحة المعلم مبنية في المرحلة ٢، أما شاشات الطالب فتُبنى في مراحل لاحقة.',
      builtHeading: 'ما هو مُبنى حتى الآن',
      built: [
        'طبقة التصميم كاملة: ألوان العلامة وألوان الحالات وألوان الواجهة المقترحة.',
        'الخطوط الأربعة المعتمدة: Sora وNunito للاتينية، Alexandria وBaloo Bhaijaan 2 للعربية.',
        'تخطيط عربي كامل من اليمين إلى اليسار بسمة ضوئية فقط.',
        'شريط هوية بالشعار الكامل على الشاشات الكبيرة، وبالاسم النصي المعتمد (120 بكسل فأكثر) على الشريط الصغير.',
        'تنقّل المعلم وتنقّل الطالب مع مفتاح معاينة الدور.',
        'لوحة المعلم: الصفوف وآخر الاختبارات وتقدّم الطلاب عبر طبقة البيانات.',
      ],
      notBuiltHeading: 'ما لم يُبنَ بعد',
      notBuiltLead:
        'باقي شاشات المنتج تُبنى في المراحل التالية. الروابط أدناه تفتح صفحات إرشادية فارغة، وليست شاشات منتج.',
    },
    roleHint: 'بدّل دور المعاينة من أعلى الشاشة (بخانة "دور المعاينة")، أو مباشرة من عنوان الصفحة:',
    codeHint: '…?as=teacher أو …?as=student',
  },
  dashboard: {
    headTitle: 'لوحة المعلم — Bridgio',
    badge: 'لوحة المعلم',
    title: 'وفّر وقت المتابعة',
    lead:
      'صفوفك وآخر اختباراتك وتقدّم طلابك في شاشة واحدة، حتى تصل إلى ما يحتاج متابعة دون التنقّل بين الصفحات.',
    greeting: (name: string) => `أهلًا، ${name}.`,
    totals: {
      label: 'ملخّص سريع',
      classes: 'الصفوف',
      students: 'الطلاب',
      publishedTests: 'اختبارات منشورة',
      draftTests: 'مسودات',
    },
    classes: {
      heading: 'الصفوف',
      emptyTitle: 'لا توجد صفوف بعد',
      emptyBody:
        'لا توجد صفوف مرتبطة بحسابك في هذه النسخة. تظهر هنا تلقائيًا عند توفرها عبر طبقة البيانات.',
      students: 'الطلاب',
      units: 'الوحدات',
      lessons: 'الدروس',
    },
    tests: {
      heading: 'آخر الاختبارات',
      emptyTitle: 'لا توجد اختبارات بعد',
      emptyBody:
        'لم يُنشأ أي اختبار بعد. تظهر آخر خمسة اختبارات هنا عند توفرها.',
      questions: 'أسئلة',
      updated: 'آخر تعديل',
      unknownDate: 'تاريخ غير متاح',
      statusPublished: 'منشور',
      statusDraft: 'مسودة',
    },
    progress: {
      heading: 'تقدّم الطلاب',
      lead: 'مرتّب من الأقل تقدّمًا، لتبدأ المتابعة من حيث يحتاجها الطالب.',
      emptyTitle: 'لا يوجد تقدّم لعرضه بعد',
      emptyBody: 'عند انضمام الطلاب إلى صفوفك، يظهر تقدّمهم هنا.',
      percentLabel: 'التقدّم',
      unitsCompleted: 'الوحدات المكتملة',
      lastActive: 'آخر نشاط',
      noActivity: 'لا نشاط مسجّل',
      barLabel: (name: string) => `تقدّم ${name}`,
    },
    loading: 'جارٍ تحميل لوحتك…',
    loadErrorTitle: 'تعذّر تحميل لوحتك.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    noSessionTitle: 'لا توجد جلسة معلم.',
    noSessionBody:
      'تسجيل الدخول والأدوار مسؤولية Mentingo، ولم تُوصَل بعد. هذه شاشة معاينة داخلية فقط.',
    emptyAllTitle: 'لا يوجد شيء هنا بعد',
    emptyAllBody:
      'لا صفوف ولا اختبارات بعد. تظهر البيانات هنا تلقائيًا عند توفرها عبر طبقة البيانات.',
  },
  placeholder: {
    badge: 'شاشة لم تُبنَ بعد',
    notBuiltYetTeacher:
      'صفحة إرشادية فقط، لا شاشة منتج. وفق خطة المراحل، تُبنى هذه الشاشة في مرحلة لاحقة.',
    notBuiltYetStudent:
      'دي مش شاشة منتج، مجرد صفحة إرشادية. الشاشة نفسها هتيجي خطوة خطوة في مراحل جاية.',
    builtBy: 'تُبنى:',
    homeScreenName: 'هيكل التطبيق والعلامة',
    screens: {
      'shell-home': 'هيكل التطبيق والعلامة',
      'teacher-dashboard': 'لوحة المعلم',
      'teacher-classes': 'صفوفي',
      'teacher-tests': 'الاختبارات',
      'teacher-students': 'الطلاب',
      'student-tests': 'اختباراتي',
      'student-lessons': 'الدروس',
      'student-progress': 'تقدمي',
    },
    builtByScreen: {
      'shell-home': 'هذه المرحلة (١) — فقط كموضع للهيكل.',
      'teacher-dashboard': 'المرحلة ٢ — لوحة المعلم.',
      'teacher-classes': 'المرحلة ٢ — الصفوف تظهر الآن في لوحة التحكم فقط.',
      'teacher-tests': 'المرحلة ٣ — منشئ الاختبارات.',
      'teacher-students':
        'المرحلة ٢ — تقدّم الطلاب يظهر الآن في لوحة التحكم فقط.',
      'student-tests': 'المرحلة ٤ — مشغّل الاختبار.',
      'student-lessons': 'لم يُحدَّد في خطة المراحل بعد — دون وعود.',
      'student-progress': 'لم يُحدَّد في خطة المراحل بعد — دون وعود.',
    } as Record<ScreenId, string>,
  },
  root: {
    notFound: 'الصفحة غير موجودة.',
    notFoundBody: 'راجع التنقّل أعلاه، أو عد إلى زر الرجوع في المتصفح.',
    errorTitle: 'حدث خطأ غير متوقع.',
    errorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
  },
} as const

export const en = {
  shell: {
    footerEn:
      'Stage 2 teacher dashboard: classes, recent tests and student progress through the mock adapter. Not final.',
  },
} as const
