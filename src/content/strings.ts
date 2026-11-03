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
    title: 'Bridgio — المرحلة ١: هيكل التطبيق والعلامة',
    description:
      'هيكل تطبيق Bridgio هذا الأسبوع: ألوان العلامة والحالات، الخطوط المعتمدة، تخطيط عربي كامل من اليمين إلى اليسار، وشريط هوية وتنقّل. نسخة داخلية للتحقق، وليست نسخة منتج.',
  },
  stageBanner: {
    stage: 'المرحلة ١ من ٧',
    note: 'بناء داخلي للتحقق من العلامة. لا شيء في هذه النسخة نهائي.',
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
        'هذه الشاشة تُظهر الهيكل فقط: شريط الهوية أعلى الصفحة، وتنقّل المعلم أو الطالب حسب الدور المختار. لا شاشات منتج في هذه المرحلة.',
      builtHeading: 'ما هو مُبنى في هذه المرحلة',
      built: [
        'طبقة التصميم كاملة: ألوان العلامة وألوان الحالات وألوان الواجهة المقترحة.',
        'الخطوط الأربعة المعتمدة: Sora وNunito للاتينية، Alexandria وBaloo Bhaijaan 2 للعربية.',
        'تخطيط عربي كامل من اليمين إلى اليسار بسمة ضوئية فقط.',
        'شريط هوية بجمّة الشعار الكاملة على الشاشات الكبيرة، وبالاسم النصي المعتمد (120 بكسل فأكثر) على الشريط الصغير.',
        'تنقّل المعلم وتنقّل الطالب مع مفتاح معاينة الدور.',
      ],
      notBuiltHeading: 'ما لم يُبنَ بعد',
      notBuiltLead:
        'شاشات المنتج تُبنى في المراحل التالية. الروابط أدناه تفتح صفحات إرشادية فارغة، وليست شاشات منتج.',
    },
    roleHint: 'بدّل دور المعاينة من أعلى الشاشة (بخانة "دور المعاينة")، أو مباشرة من عنوان الصفحة:',
    codeHint: '…?as=teacher أو …?as=student',
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
      'teacher-classes': 'المرحلة ٢ — ضمن لوحة المعلم وصفوفها.',
      'teacher-tests': 'المرحلة ٣ — منشئ الاختبارات.',
      'teacher-students': 'المرحلة ٢ — تتبّع تقدّم الطلاب.',
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
    footerEn: 'Stage 1 shell: tokens, fonts, RTL, header/nav. No product screens.',
  },
} as const
