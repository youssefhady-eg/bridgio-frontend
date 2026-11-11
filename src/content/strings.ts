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

import { countPhrase, englishCount, type NounForms } from './plural'

/**
 * Swap points for the two working names. Every Arabic string that mentions a
 * name interpolates these two consts, so a rename is a one-line change here
 * (brand.name / assistant.nameAr) plus the matching artwork file name.
 */
const B = brand.name
const M = assistant.nameAr

/**
 * Counted nouns, per register (see `plural.ts`). Teacher screens use formal
 * Arabic; the student screens use Egyptian casual Arabic, whose dual is "-ين".
 */
const questionsMsa: NounForms = { one: 'سؤال واحد', two: 'سؤالان', few: 'أسئلة', many: 'سؤالًا' }
const questionsEgy: NounForms = { one: 'سؤال واحد', two: 'سؤالين', few: 'أسئلة', many: 'سؤال' }
const wordsMsa: NounForms = { one: 'كلمة واحدة', two: 'كلمتان', few: 'كلمات', many: 'كلمة' }
const lessonsMsa: NounForms = { one: 'درس واحد', two: 'درسان', few: 'دروس', many: 'درسًا' }
const lessonsEgy: NounForms = { one: 'درس واحد', two: 'درسّين', few: 'دروس', many: 'درس' }
const unitsMsa: NounForms = { one: 'وحدة واحدة', two: 'وحدتان', few: 'وحدات', many: 'وحدة' }
const testsMsa: NounForms = { one: 'اختبار واحد', two: 'اختباران', few: 'اختبارات', many: 'اختبارًا' }
const studentsMsa: NounForms = { one: 'طالب واحد', two: 'طالبان', few: 'طلاب', many: 'طالبًا' }
const materialsMsa: NounForms = { one: 'مادة واحدة', two: 'مادتان', few: 'مواد', many: 'مادة' }

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
  | 'parent-progress'
  | 'parent-tests'
  | 'parent-results'
  | 'parent-messages'

/** Preview roles (`?as`) — diagnostic UI state only, never auth. */
export type PreviewRoleId = 'teacher' | 'student' | 'assistant' | 'parent'

/** DRAFT Arabic — not approved final copy. */
export const ar = {
  head: {
    title: `${B} — هيكل بشريط جانبي ودعم كامل للعربية والإنجليزية`,
    description:
      `نسخة تحسين الهيكل في ${B}: شريط جانبي للتنقّل لكل الأدوار، شريط علوي مختصر، خطوط عربية Thmanyah، ومفتاح كامل بين العربية والإنجليزية مع اتجاه من اليسار إلى اليمين. بتخطيط مبني على الخصائص المنطقية وبالبيانات التجريبية عبر طبقة البيانات. هذه نسخة داخلية للتحقق وليست نسخة منتج نهائية.`,
  },
  stageBanner: {
    stage: 'تحسين الهيكل — فرع منفصل',
    note: 'شريط جانبي وشريط علوي مختصر وخطوط عربية ومفتاح لغة. البيانات تجريبية وتأتي عبر طبقة البيانات، وليست بيانات حقيقية.',
  },
  header: {
    navLabel: 'التنقّل الرئيس',
    lockupAlt: `شعار ${B} الكامل (الشخصية والاسم معًا).`,
    wordmarkAlt: `اسم ${B} النصي المعتمد.`,
    skipToMain: 'تخطَّ إلى المحتوى',
    menuLabel: 'افتح قائمة التنقّل',
    menuCloseLabel: 'إغلاق القائمة',
    utilityLabel: 'شريط الأدوات',
    langLabel: 'اللغة',
    langToEnglish: 'English',
    langToArabic: 'العربية',
    langGlyphEnglish: 'EN',
    langGlyphArabic: 'ع',
    assistantLabel: 'المحادثات',
    assistantOpenLabel: 'افتح المحادثات',
    accountLabel: 'الحساب',
    accountNote: 'تسجيل الدخول والأدوار مسؤولية Mentingo، ولم تُوصَل بعد.',
    themeLabel: 'المظهر',
    themeToDark: 'المظهر الداكن',
    themeToLight: 'المظهر الفاتح',
  },
  /**
   * Preview-role diagnostic (`?as`) — UI state only, never auth. Moved out of
   * the header into the footer so the header stays a slim utility bar.
   */
  preview: {
    groupAria: 'معاينة الدور — حالة واجهة فقط، دون تسجيل دخول.',
    label: 'دور المعاينة:',
    roles: {
      teacher: 'المعلم',
      student: 'الطالب',
      assistant: 'مساعد المعلم',
      parent: 'وليّ الأمر',
    } as Record<PreviewRoleId, string>,
  },
  /** Primary navigation sidebar (all roles). */
  sidebar: {
    navLabel: 'التنقّل الرئيس',
    openLabel: 'افتح قائمة التنقّل',
    closeLabel: 'إغلاق القائمة',
    collapseLabel: 'طيّ القائمة الجانبية',
    expandLabel: 'توسيع القائمة الجانبية',
    assistantNote:
      'تظهر هذه العناصر بحسب الصلاحيات الممنوحة لهذا الحساب من الخادم. لا واجهة منح في هذه النسخة.',
    utilitiesLabel: 'روابط مساعدة',
    helpLabel: 'المساعدة والدليل',
    profileLabel: 'الملف الشخصي',
  },
  /** Nav item labels — teacher copy is MSA formal, student copy is Egyptian casual, parent copy is MSA formal. */
  nav: {
    'teacher-dashboard': 'لوحة التحكم',
    'teacher-classes': 'صفوفي',
    'teacher-tests': 'الاختبارات',
    'teacher-students': 'الطلاب',
    'student-tests': 'اختباراتي',
    'student-lessons': 'دروسي',
    'student-progress': 'تقدمي',
    'parent-progress': 'تقدّم الابن',
    'parent-tests': 'الاختبارات',
    'parent-results': 'النتائج',
    'parent-messages': 'الرسائل',
  } as Record<
    | 'teacher-dashboard'
    | 'teacher-classes'
    | 'teacher-tests'
    | 'teacher-students'
    | 'student-tests'
    | 'student-lessons'
    | 'student-progress'
    | 'parent-progress'
    | 'parent-tests'
    | 'parent-results'
    | 'parent-messages',
    string
  >,
  footer: {
    demoNote: 'البيانات المعروضة هنا تجريبية.',
    note: `${B} و${M} اسمان عملان قابلان للتغيير، وصياغة العربية مسودات بانتظار المراجعة.`,
    noteEn: `${B} — internal build for brand verification. Not final, nothing external-facing.`,
  },
  shell: {
    home: {
      badge: 'الهيكل والعلامة',
      title: 'هيكل التطبيق: الألوان، الخطوط، التخطيط',
      lead:
        'هذه شاشة إرشادية للهيكل فقط. لوحة المعلم مبنية في المرحلة ٢، ومشغّل اختبار الطالب في المرحلة ٤، أما بقية شاشات الطالب فتُبنى في مراحل لاحقة.',
      builtHeading: 'ما هو مُبنى حتى الآن',
      built: [
        'طبقة التصميم كاملة: ألوان العلامة وألوان الحالات وألوان الواجهة المقترحة.',
        'خط عربي Thmanyah للواجهة (بأسماء Thmanyah وتحويل احتياطي إلى Alexandria، لأن ملفات الخط غير مضمّنة في المستودع العام).',
        'Sora وNunito للاتينية في الواجهة الإنجليزية.',
        'شريط جانبي ثابت للتنقّل الأساسي لكل الأدوار، وعلى الهاتف يظهر كدُرج من زر القائمة.',
        'شريط علوي مختصر: العلامة ومفتاح اللغة وزر المحادثات ومنطقة الحساب (دون روابط تنقّل).',
        'مفتاح كامل بين العربية والإنجليزية مع تبديل اتجاه الصفحة من اليمين إلى اليسار.',
        'تنقّل المعلم وتنقّل الطالب وتنقّل وليّ الأمر، ومساعد المعلم بحسب الصلاحيات الممنوحة من الخادم.',
        'لوحة المعلم: الصفوف وآخر الاختبارات وتقدّم الطلاب عبر طبقة البيانات.',
        'منشئ الاختبارات: أربع خطوات من اختيار المصدر إلى النشر، عبر طبقة البيانات.',
        `مشغّل اختبار الطالب: السؤال والخيارات والتقدّم والتسليم، مع لوحة أسئلة ${M}، عبر طبقة البيانات.`,
        'عرض وليّ الأمر للقراءة فقط: التقدّم والاختبارات والنتائج والرسائل، عبر طبقة البيانات.',
      ],
      notBuiltHeading: 'ما لم يُبنَ بعد',
      notBuiltLead:
        'باقي شاشات المنتج تُبنى في المراحل التالية. الروابط أدناه تفتح صفحات إرشادية فارغة، وليست شاشات منتج.',
    },
    roleHint:
      'بدّل دور المعاينة (تشخيصي فقط) من أسفل الشاشة، أو مباشرة من عنوان الصفحة:',
    codeHint:
      '…?as=teacher أو …?as=student أو …?as=assistant أو …?as=parent',
  },
  dashboard: {
    headTitle: `لوحة المعلم — ${B}`,
    badge: 'لوحة المعلم',
    title: 'وفّر وقت المتابعة',
    quickActions: {
      heading: 'إجراءات سريعة',
      createTest: 'أنشئ اختبارًا',
      createTestBody: 'افتح منشئ الاختبار وابدأ اختبارًا جديدًا.',
      viewTests: 'اعرض الاختبارات',
      viewTestsBody: 'راجع اختباراتك من صفحة الاختبارات.',
    },
    activity: {
      heading: 'آخر النشاط',
      lead: 'أحدث الاختبارات التي عملت عليها، الأحدث أولًا.',
      emptyTitle: 'لا نشاط بعد',
      emptyBody: 'سيظهر هنا آخر ما عملت عليه من اختبارات.',
    },
    attention: {
      heading: 'اختبارات تحتاج انتباهك',
      lead: 'المسودات غير المنشورة أولًا، حتى لا يبقى اختبار ناقص.',
      emptyTitle: 'لا اختبارات معلّقة',
      emptyBody: 'كل اختباراتك منشورة، ولا شيء يحتاج انتباهك الآن.',
    },
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
        'لا توجد صفوف مرتبطة بحسابك بعد. ستظهر هنا بمجرد إضافتها.',
      students: 'الطلاب',
      units: 'الوحدات',
      lessons: 'الدروس',
    },
    tests: {
      heading: 'آخر الاختبارات',
      emptyTitle: 'لا توجد اختبارات بعد',
      emptyBody:
        'لم يُنشأ أي اختبار بعد. تظهر آخر خمسة اختبارات هنا عند توفرها.',
      questionsCount: (count: number) => countPhrase(count, questionsMsa),
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
      'لا صفوف ولا اختبارات بعد. ستظهر هنا بمجرد إضافتها.',
  },
  builder: {
    headTitle: `منشئ الاختبارات — ${B}`,
    badge: 'منشئ الاختبارات',
    title: 'أنشئ اختبارًا في أربع خطوات',
    lead:
      `اختر المادة أو وحدة المنهج، ودع ${M} يصوغ الأسئلة من المصدر المحدد، ثم راجعها وعدّلها، وانشرها إلى صفك. كل خطوة تحفظ وقت إعداد الاختبار.`,
    stepsLabel: 'خطوات إنشاء الاختبار',
    stepDone: 'اكتملت',
    steps: {
      1: 'اختيار المصدر',
      2: `صياغة ${M}`,
      3: 'المراجعة والتعديل',
      4: 'النشر',
    } as Record<1 | 2 | 3 | 4, string>,
    loading: 'جارٍ تحميل منشئ الاختبار…',
    loadErrorTitle: 'تعذّر تحميل منشئ الاختبار.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    noSessionTitle: 'لا توجد جلسة معلم.',
    noSessionBody:
      'تسجيل الدخول والأدوار مسؤولية Mentingo، ولم تُوصَل بعد. هذه شاشة معاينة داخلية فقط.',
    source: {
      heading: 'اختر المادة أو وحدة المنهج',
      lead:
        `اختر الصف أولًا، ثم حدّد مصدر الأسئلة. يبقى المصدر ظاهرًا مع كل مسودة ومع كل سؤال صاغه ${M}.`,
      classLabel: 'الصف',
      classPlaceholder: 'اختر صفًا',
      classesEmptyTitle: 'لا توجد صفوف بعد',
      classesEmptyBody:
        'لا توجد صفوف مرتبطة بحسابك بعد. ستظهر هنا بمجرد إضافتها.',
      classesError: 'تعذّر تحميل الصفوف. أعد المحاولة بعد قليل.',
      kindLabel: 'نوع المصدر',
      kindMaterial: 'مادة من موادّي',
      kindUnit: 'وحدة من المنهج',
      selectClassHint: 'اختر صفًا أولًا لعرض المواد ووحدات المنهج المتاحة له.',
      materialHeading: 'المواد المتاحة',
      materialReady: 'جاهزة للاستخدام',
      materialWords: (count: number) => countPhrase(count, wordsMsa),
      unitLessons: (count: number) => countPhrase(count, lessonsMsa),
      materialsLoading: 'جارٍ تحميل المواد…',
      materialsEmptyTitle: 'لا توجد مواد لهذا الصف',
      materialsEmptyBody:
        'لم تُرفع مادة لهذا الصف بعد. يمكنك اختيار وحدة من منهج الصف بدلًا من ذلك.',
      materialsError: 'تعذّر تحميل المواد. أعد المحاولة بعد قليل.',
      materialProcessing: 'قيد المعالجة',
      unitHeading: 'وحدات منهج الصف',
      unitsLoading: 'جارٍ تحميل وحدات المنهج…',
      unitsEmptyTitle: 'لا توجد وحدات لهذا الصف',
      unitsEmptyBody:
        'لا توجد وحدات منهج مرتبطة بهذا الصف. جرّب صفًا آخر أو اختر مادة من موادّك.',
      unitsError: 'تعذّر تحميل وحدات المنهج. أعد المحاولة بعد قليل.',
      titleLabel: 'عنوان الاختبار',
      titlePlaceholder: 'مثال: مراجعة قواعد الاشتقاق',
      titleHint: 'يظهر هذا العنوان للطلاب بعد النشر.',
      descriptionLabel: 'وصف مختصر (اختياري)',
      descriptionPlaceholder: 'ما الذي يغطيه الاختبار؟',
      lockedNote:
        'لا يمكن تغيير الصف أو المصدر بعد بدء المسودة. لبدء مصدر مختلف، أنهِ هذه المسودة أو ابدأ اختبارًا جديدًا بعد النشر.',
      createDraft: 'متابعة إلى صياغة الأسئلة',
      creatingDraft: 'جارٍ إنشاء المسودة…',
      createDraftErrorTitle: 'تعذّر إنشاء المسودة.',
      createDraftErrorBody:
        'من جهتنا، لا من جهتك. راجع الحقول وأعد المحاولة.',
    },
    draft: {
      heading: `يصوغ ${M} الأسئلة`,
      lead:
        `يصوغ ${M} الأسئلة من المصدر المحدد فقط: مادتك أو وحدة المنهج. يظهر المصدر مع كل سؤال، ولا يصوغ سؤالًا بلا مصدر.`,
      focusLabel: `توجيه اختياري ل${M}`,
      focusPlaceholder: 'مثال: ركّز على قاعدة الضرب',
      countLabel: 'عدد الأسئلة المطلوبة',
      countHint:
        `من ١ إلى ١٠. قد يعيد ${M} عددًا أقل إذا لم يجد ما يكفي في المصدر.`,
      sourceLabel: 'المصدر',
      request: `اطلب من ${M} الصياغة`,
      requestMore: 'أضف أسئلة أخرى',
      retry: 'أعد المحاولة',
      requesting: 'جارٍ الصياغة من المصدر…',
      idleTitle: 'لم تُطلب الصياغة بعد',
      idleBody:
        `اضغط زر الصياغة ليقرأ ${M} من المصدر المحدد ويقترح أسئلة مسودة قابلة للتعديل والحذف.`,
      draftedTitle: 'مسودة الأسئلة',
      draftedNote: 'كل سؤال هنا مسودة قابلة للتعديل والحذف قبل النشر.',
      draftedSuccessTitle: `صاغ ${M} أسئلة موثّقة`,
      draftedSuccessBody:
        `أضاف ${M} الأسئلة من المصدر المحدد فقط، ومع كل سؤال مصدره. راجعها في الأسفل قبل المتابعة.`,
      questionsCount: (count: number) =>
        `${countPhrase(count, questionsMsa)} في المسودة`,
      noGroundingTitle: 'لا توجد أسئلة جديدة من هذا المصدر',
      noGroundingFallback:
        `لم يجد ${M} ما يكفي في المصدر المحدد لصياغة أسئلة. لن يخمّن.`,
      draftErrorTitle: 'تعذّرت صياغة الأسئلة.',
      draftErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
      nextReview: 'راجع الأسئلة',
    },
    review: {
      heading: 'راجع الأسئلة وعدّلها',
      lead:
        `كل سؤال صاغه ${M} قابل للتعديل والحذف قبل النشر. لا تُنشر أي مسودة قبل مراجعتك.`,
      loading: 'جارٍ تحميل أسئلة المسودة…',
      loadErrorTitle: 'تعذّر تحميل الأسئلة.',
      loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
      emptyTitle: 'لا توجد أسئلة بعد',
      emptyBody:
        `عد إلى الخطوة الثانية واطلب من ${M} صياغة الأسئلة من المصدر المحدد. لا يمكن النشر بلا سؤال واحد.`,
      backToDraft: 'العودة إلى صياغة الأسئلة',
      listHeading: 'الأسئلة في المسودة',
      questionNumber: (number: string) => `السؤال ${number}`,
      originMohsen: `صاغه ${M}`,
      originTeacher: 'بقلم المعلم',
      groundingLabel: 'مصدر السؤال',
      correctLabel: 'الإجابة المرجعية',
      correctNone: 'لم تُحدَّد',
      edit: 'تعديل',
      delete: 'حذف',
      deleteConfirm: 'احذف السؤال',
      deleteConfirmPrompt: 'حذف هذا السؤال؟ لا يمكن التراجع عن ذلك.',
      deleteCancel: 'أبقِ السؤال',
      save: 'حفظ التعديل',
      saving: 'جارٍ الحفظ…',
      cancel: 'إلغاء التعديل',
      promptLabel: 'نص السؤال',
      optionsLabel: 'الخيارات',
      optionLabel: (number: string) => `الخيار ${number}`,
      correctHint:
        'تُحفظ الإجابة المرجعية للمعلم فقط؛ لا يوجد تصحيح آلي حاليًا.',
      addOption: 'أضف خيارًا',
      removeOption: (number: string) => `احذف الخيار ${number}`,
      issuePrompt: 'اكتب نص السؤال.',
      issueOptions: 'اكتب من خيارين إلى ستة خيارات، دون خيار فارغ.',
      issueCorrect: 'حدّد إجابة مرجعية من الخيارات.',
      updateErrorTitle: 'تعذّر حفظ التعديل.',
      updateErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة.',
      deleteErrorTitle: 'تعذّر حذف السؤال.',
      deleteErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة.',
      nextPublish: 'متابعة إلى النشر',
    },
    publish: {
      heading: 'انشر إلى الصف',
      lead:
        'راجع الملخّص ثم انشر الاختبار إلى الصف المحدد. النشر يجعل الاختبار متاحًا للطلاب.',
      summaryTitle: 'ملخّص الاختبار',
      titleLabel: 'العنوان',
      classLabel: 'الصف',
      sourceLabel: 'المصدر',
      questionsLabel: 'عدد الأسئلة',
      statusLabel: 'الحالة',
      statusDraft: 'مسودة',
      statusPublished: 'منشور',
      groundingTitle: 'مصادر الأسئلة',
      publishButton: 'انشر الاختبار',
      publishing: 'جارٍ النشر…',
      publishErrorTitle: 'تعذّر نشر الاختبار.',
      publishErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
      blocked: {
        no_test: 'لا توجد مسودة بعد. ابدأ من الخطوة الأولى.',
        no_class:
          'لا يمكن النشر بلا صف محدد. ارجع إلى الخطوة الأولى واختر صفًا.',
        no_questions:
          `لا يمكن النشر بلا سؤال واحد. ارجع إلى الخطوة الثالثة وأضف سؤالًا أو اطلب من ${M} الصياغة.`,
        already_published: 'هذا الاختبار منشور بالفعل.',
      },
      blockedTitle: 'النشر غير متاح بعد',
      successTitle: 'تم نشر الاختبار',
      successBody: (title: string, className: string) =>
        `نُشر «${title}» إلى ${className}.`,
      successNote:
        'يمكنك إنشاء اختبار جديد الآن. لا يوجد تصحيح آلي أو احتساب درجات حاليًا.',
      newTest: 'أنشئ اختبارًا جديدًا',
      noGrounding: 'لا يوجد مصدر معروض.',
    },
    grounding: {
      label: 'المصدر',
      material: 'مادة',
      unit: 'وحدة منهج',
    },
    nav: {
      back: 'السابق',
      next: 'التالي',
    },
  },
  player: {
    headTitle: `اختباراتي — ${B}`,
    badge: 'حلّ الاختبارات',
    title: 'ابدأ الاختبار خطوة خطوة',
    lead:
      `اختار الاختبار، جاوب على الأسئلة، وسلّم. وفي أي وقت تقدر تسأل ${M} جنبك على أي حاجة من مادة الاختبار.`,
    loading: 'بنحمّل اختباراتك...',
    loadErrorTitle: 'مش قادرين نحمّل اختباراتك.',
    loadErrorBody: 'المشكلة من جهتنا مش من جهتك. جرّب تاني بعد شوية.',
    noSessionTitle: 'مفيش جلسة طالب.',
    noSessionBody:
      'تسجيل الدخول والأدوار مسؤولية Mentingo ولسه مش متوصّلة. دي شاشة معاينة داخلية بس.',
    list: {
      heading: 'الاختبارات المتاحة',
      lead: 'دي الاختبارات المنشورة لصفوفك. دوس على الاختبار تبدأ أو تكمّل.',
      emptyTitle: 'مفيش اختبارات لسه',
      emptyBody: 'لما المعلم ينشر اختبار لصفك، هيظهر هنا على طول.',
      questions: (count: number) => countPhrase(count, questionsEgy),
      statusNew: 'جديد',
      statusInProgress: 'شغّال',
      statusSubmitted: 'تم التسليم',
      start: 'ابدأ الاختبار',
      resume: 'كمّل الاختبار',
      submittedNote: 'سلّمت الاختبار ده خلاص. لسه مفيش تصحيح.',
      starting: 'بنبدأ الاختبار...',
      startErrorTitle: 'مش عارفين نبدأ الاختبار.',
      startErrorBody: 'جرّب تاني بعد شوية.',
    },
    runner: {
      loading: 'بنحمّل الاختبار...',
      loadErrorTitle: 'مش قادرين نفتح الاختبار.',
      loadErrorBody: 'جرّب تاني بعد شوية.',
      progressLabel: 'تقدّمك',
      questionCount: (current: string, total: string) =>
        `سؤال ${current} من ${total}`,
      optionsLabel: 'اختار إجابة واحدة',
      previous: 'السابق',
      next: 'التالي',
      saveErrorTitle: 'مش عارفين نحفظ إجابتك.',
      saveErrorBody: 'جرّب تختار تاني.',
      submit: 'سلّم الاختبار',
      submitting: 'بنسلّم...',
      submitErrorTitle: 'مش عارفين نسلّم الاختبار.',
      submitErrorBody: 'جرّب تاني بعد شوية.',
      confirmTitle: 'لسه فيه أسئلة من غير إجابة',
      confirmBody: (remaining: number) =>
        `فاضل ${countPhrase(remaining, questionsEgy)} من غير إجابة. تحب تسلّم برضه؟`,
      confirmSubmit: 'أيوه، سلّم',
      confirmContinue: 'كمّل الحل',
      changeTest: 'اختبار تاني',
      doneTitle: 'تم تسليم الاختبار',
      doneBody: (title: string) => `سجّلنا تسليمك لاختبار «${title}».`,
      doneNoMarking:
        'اتسجّلت محاولتك. لسه مفيش تصحيح آلي ولا درجات.',
      doneNext: 'تقدر تختار اختبار تاني من القائمة.',
      backToList: 'ارجع لقائمة الاختبارات',
    },
    mohsen: {
      heading: `اسأل ${M}`,
      lead:
        `${M} بيجاوب من مادة الاختبار بس، ولو مش لاقي إجابة بيقولك إنه مش عارف بدل ما يخمّن.`,
      inputLabel: 'سؤالك',
      placeholder: 'اكتب سؤالك هنا...',
      ask: 'اسأل',
      asking: 'بيسأل...',
      emptyTitle: 'لسه ما سألتش حاجة',
      empty: `اسأل ${M} على أي حاجة في الاختبار ده.`,
      questionLabel: 'سؤالك',
      answeredLabel: `إجابة ${M}`,
      refusalLabel: `${M} مش لاقي إجابة`,
      notGroundedFallback:
        'مفيش عندي إجابة موثّقة من مادة الاختبار على السؤال ده. مش هخمّن.',
      groundingLabel: 'المصدر',
      errorTitle: `${M} مش قادر يجاوب دلوقتي.`,
      errorBody: 'جرّب تاني بعد شوية.',
    },
  },
  /**
   * Parent view (UI name "Parents") — display only. Every number shown here is
   * supplied by the backend; the frontend never computes a score.
   */
  parent: {
    headTitle: `ولي الأمر — ${B}`,
    badge: 'وليّ الأمر',
    loading: 'جارٍ تحميل بيانات الابن...',
    loadErrorTitle: 'تعذّر تحميل البيانات.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    noSessionTitle: 'لا توجد جلسة وليّ أمر.',
    noSessionBody:
      'تسجيل الدخول والأدوار مسؤولية Mentingo، ولم تُوصَل بعد. هذه شاشة معاينة داخلية فقط.',
    childLabel: 'الابن',
    childPlaceholder: 'اختر ابنًا',
    readOnlyNote:
      'هذه الشاشة للعرض فقط، ولا تحتسب أي درجة.',
    progress: {
      heading: 'تقدّم الابن',
      lead: 'نظرة سريعة على تقدّم الابن في وحدات المنهج.',
      overall: 'التقدّم العام',
      completedUnits: 'الوحدات المكتملة',
      lastActive: 'آخر نشاط',
      noActivity: 'لا نشاط مسجّل',
      unitsHeading: 'الوحدات',
      lessonsCompleted: 'دروس مكتملة',
      emptyTitle: 'لا يوجد تقدّم لعرضه بعد',
      emptyBody: 'سيظهر تقدّم الابن هنا بمجرد توفّره.',
      barLabel: (name: string) => `تقدّم ${name}`,
    },
    tests: {
      heading: 'اختبارات الابن',
      lead: 'حالة اختبارات الابن.',
      statusNotStarted: 'لم يبدأ',
      statusInProgress: 'قيد الحل',
      statusSubmitted: 'تم التسليم',
      answered: (answered: string, total: string) =>
        `أُجيب ${answered} من ${total}`,
      emptyTitle: 'لا توجد اختبارات بعد',
      emptyBody: 'تظهر اختبارات الابن هنا عند نشرها من المعلم.',
    },
    results: {
      heading: 'النتائج',
      lead: 'النتائج كما تحتسبها المنصة. هذه الشاشة لا تحتسب أي درجة.',
      scoreLabel: 'الدرجة',
      scoreUnavailable: 'لم تُحتسب بعد',
      submittedAt: 'تاريخ التسليم',
      unanswered: 'غير مسلَّم',
      answeredCount: (answered: string, total: string) =>
        `أُجيب ${answered} من ${total}`,
      emptyTitle: 'لا توجد نتائج بعد',
      emptyBody: 'ستظهر نتائج الابن هنا بعد اكتمال التصحيح.',
    },
    messages: {
      heading: 'الرسائل',
      lead: 'محادثات داخلية تجريبية مع المعلم ومساعد المعلم. لا إشعارات ولا اتصال فوري.',
      open: 'افتح المحادثات',
    },
  },
  /**
   * In-app chat popup — mock only, in the pattern of the planned AI Chat popup.
   * No real-time transport and no notifications are claimed.
   */
  chat: {
    title: 'المحادثات',
    openLabel: 'افتح المحادثات',
    closeLabel: 'إغلاق المحادثات',
    threadsLabel: 'المحادثات',
    noThreads: 'لا توجد محادثات بعد.',
    selectThread: 'اختر محادثة لعرض الرسائل.',
    loading: 'جارٍ تحميل المحادثات...',
    loadError: 'تعذّر تحميل المحادثات. أعد المحاولة بعد قليل.',
    messagesLoading: 'جارٍ تحميل الرسائل...',
    messagesError: 'تعذّر تحميل الرسائل. أعد المحاولة بعد قليل.',
    empty: 'لا توجد رسائل بعد. اكتب أول رسالة.',
    inputLabel: 'رسالتك',
    placeholder: 'اكتب رسالتك هنا...',
    send: 'إرسال',
    sending: 'جارٍ الإرسال...',
    sendError: 'تعذّر إرسال الرسالة. أعد المحاولة.',
    youLabel: 'أنت',
    replyFrom: (name: string) => `الرد من ${name}`,
    mockNote:
      'محادثة داخلية تجريبية فقط، دون إشعارات أو اتصال فوري أو قناة خارجية.',
    roleNames: {
      parent: 'وليّ الأمر',
      teacher: 'المعلم',
      assistant: 'مساعد المعلم',
    } as Record<'parent' | 'teacher' | 'assistant', string>,
  },
  /** Teacher classes list + detail — frontend-finish. Teacher register: MSA. */
  classes: {
    headTitle: `صفوفي — ${B}`,
    badge: 'صفوفي',
    title: 'صفوفك ووحداتها',
    lead: 'اعرض كل صف مع عدد طلابه ووحداته ودروسه، وافتح الصف لعرض تفاصيله.',
    loading: 'جارٍ تحميل الصفوف...',
    loadErrorTitle: 'تعذّر تحميل الصفوف.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    emptyTitle: 'لا توجد صفوف بعد',
    emptyBody: 'لا توجد صفوف مرتبطة بحسابك بعد. ستظهر هنا بمجرد إضافتها.',
    students: 'الطلاب',
    units: 'الوحدات',
    lessons: 'الدروس',
    open: 'افتح الصف',
    detail: {
      back: 'كل الصفوف',
      loading: 'جارٍ تحميل الصف...',
      loadErrorTitle: 'تعذّر تحميل هذا الصف.',
      loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
      notFoundTitle: 'الصف غير موجود.',
      notFoundBody: 'ربما حُذف الصف أو أن الرابط غير صحيح.',
      unitsHeading: 'الوحدات',
      unitsLead: 'وحدات المنهج المرتبطة بهذا الصف مع عدد المواد والاختبارات.',
      unitsEmptyTitle: 'لا توجد وحدات لهذا الصف',
      unitsEmptyBody: 'لم تُربط وحدات منهج بهذا الصف بعد.',
      materialCount: (count: number) => countPhrase(count, materialsMsa),
      testCount: (count: number) => countPhrase(count, testsMsa),
      lessonsCount: (count: number) => countPhrase(count, lessonsMsa),
      rosterHeading: 'طلاب الصف',
      rosterLead: 'قائمة الطلاب مع تقدّم كل طالب في الصف.',
      rosterEmptyTitle: 'لا يوجد طلاب بعد',
      rosterEmptyBody: 'عند انضمام الطلاب إلى الصف يظهرون هنا.',
      rosterError: 'تعذّر تحميل قائمة الطلاب.',
      testsHeading: 'اختبارات الصف',
      testsLead: 'اختبارات هذا الصف، الأحدث أولًا.',
      testsEmptyTitle: 'لا توجد اختبارات لهذا الصف',
      testsEmptyBody: 'لم يُنشأ اختبار لهذا الصف بعد.',
    },
  },
  /** Teacher students list + detail — frontend-finish. Teacher register: MSA. */
  students: {
    headTitle: `الطلاب — ${B}`,
    badge: 'الطلاب',
    title: 'طلابك وتقدّمهم',
    lead: 'كل طلاب صفوفك في مكان واحد، مع تقدّم كل طالب وآخر نشاط.',
    loading: 'جارٍ تحميل الطلاب...',
    loadErrorTitle: 'تعذّر تحميل الطلاب.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    emptyTitle: 'لا يوجد طلاب بعد',
    emptyBody: 'عند انضمام الطلاب إلى صفوفك يظهرون هنا.',
    open: 'افتح الطالب',
    classLabel: 'الصف',
    progressLabel: 'التقدّم',
    lastActive: 'آخر نشاط',
    noActivity: 'لا نشاط مسجّل',
    detail: {
      back: 'كل الطلاب',
      loading: 'جارٍ تحميل بيانات الطالب...',
      loadErrorTitle: 'تعذّر تحميل بيانات الطالب.',
      loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
      notFoundTitle: 'الطالب غير موجود.',
      notFoundBody: 'ربما حُذف الطالب أو أن الرابط غير صحيح.',
      overallLabel: 'التقدّم العام',
      classLabel: 'الصف',
      unitsHeading: 'الوحدات',
      unitsLead: 'تقدّم الطالب في وحدات الصف.',
      lessonsCompleted: 'الدروس المكتملة',
      lastActive: 'آخر نشاط',
      noActivity: 'لا نشاط مسجّل',
      emptyTitle: 'لا يوجد تقدّم لعرضه بعد',
      emptyBody: 'سيظهر تقدّم الطالب هنا بمجرد توفّره.',
      barLabel: (name: string) => `تقدّم ${name}`,
    },
  },
  /** One test: questions, publish state, results link. Teacher register: MSA. */
  testDetail: {
    headTitle: `تفاصيل الاختبار — ${B}`,
    badge: 'تفاصيل الاختبار',
    loading: 'جارٍ تحميل الاختبار...',
    loadErrorTitle: 'تعذّر تحميل الاختبار.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    notFoundTitle: 'الاختبار غير موجود.',
    notFoundBody: 'ربما حُذف الاختبار أو أن الرابط غير صحيح.',
    back: 'كل الاختبارات',
    metaClass: 'الصف',
    metaSource: 'المصدر',
    metaQuestions: 'عدد الأسئلة',
    metaUpdated: 'آخر تعديل',
    metaPublished: 'تاريخ النشر',
    statusPublished: 'منشور',
    statusDraft: 'مسودة',
    unknownDate: 'تاريخ غير متاح',
    readOnlyTitle: 'الاختبار منشور',
    readOnlyBody:
      'الاختبارات المنشورة للقراءة فقط في هذه النسخة. لا يمكن تعديل المشاركة أو الأسئلة بعد النشر.',
    editHeading: 'تعديل بيانات الاختبار',
    editLead: 'يمكن تعديل العنوان والوصف ما دام الاختبار مسودة.',
    titleLabel: 'عنوان الاختبار',
    descriptionLabel: 'وصف مختصر (اختياري)',
    descriptionPlaceholder: 'ما الذي يغطيه الاختبار؟',
    save: 'حفظ التعديل',
    saving: 'جارٍ الحفظ...',
    saved: 'تم حفظ التعديل.',
    saveErrorTitle: 'تعذّر حفظ التعديل.',
    saveErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة.',
    questionsHeading: 'أسئلة الاختبار',
    questionsLead: 'كل الأسئلة بالترتيب، مع مصدر كل سؤال.',
    questionsEmptyTitle: 'لا توجد أسئلة بعد',
    questionsEmptyBody: 'أضف الأسئلة من منشئ الاختبار قبل النشر.',
    publishHeading: 'النشر',
    publishLead: 'انشر الاختبار إلى الصف بعد مراجعة الأسئلة.',
    publish: 'انشر الاختبار',
    publishing: 'جارٍ النشر...',
    publishErrorTitle: 'تعذّر نشر الاختبار.',
    publishErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    publishBlockedNoQuestions: 'لا يمكن النشر بلا سؤال واحد.',
    publishSuccessTitle: 'تم نشر الاختبار',
    publishSuccessBody: (className: string) => `نُشر الاختبار إلى ${className}.`,
    resultsHeading: 'نتائج الاختبار',
    resultsUnavailableTitle: 'نتائج كل اختبار غير متاحة بعد',
    resultsUnavailableBody:
      'لا يوفّر العقد الحالي نتائج لكل اختبار. لمراجعة تقدّم الطلاب، افتح صفحة الصف.',
    resultsClassLink: 'افتح صفحة الصف',
  },
  /** Student test review + retake. Student register: Egyptian casual. */
  results: {
    headTitle: `مراجعة الاختبار — ${B}`,
    badge: 'مراجعة الاختبار',
    title: 'راجع إجاباتك',
    lead: 'شوف اللي جاوبته في الاختبار. لسه مفيش تصحيح آلي ولا درجات.',
    loading: 'بنحمّل مراجعتك...',
    loadErrorTitle: 'مش قادرين نحمّل المراجعة.',
    loadErrorBody: 'المشكلة من جهتنا مش من جهتك. جرّب تاني بعد شوية.',
    notFoundTitle: 'مفيش محاولة على الاختبار ده.',
    notFoundBody: 'ابدأ الاختبار الأول من قائمة اختباراتك.',
    back: 'ارجع لاختباراتي',
    statusLabel: 'الحالة',
    statusSubmitted: 'تم التسليم',
    statusInProgress: 'شغّال',
    submittedAtLabel: 'تاريخ التسليم',
    noSubmit: 'لسه متسلّمش',
    answeredLabel: 'الأسئلة المجابة',
    answeredValue: (answered: string, total: string) =>
      `${answered} من ${total}`,
    scoreLabel: 'الدرجة',
    scoreNote: 'الدرجات بتيجي من الباك إند ولسه مش موصولة. الشاشة دي مش بتحسب أي درجة.',
    reviewHeading: 'مراجعة الأسئلة',
    reviewLead: 'ده اختيارك في كل سؤال. مش بنقولك صح ولا غلط.',
    questionLabel: (number: string) => `السؤال ${number}`,
    yourAnswer: 'إجابتك',
    noAnswer: 'من غير إجابة',
    retakeHeading: 'إعادة المحاولة',
    retakeBody:
      'المحاكي الحالي بيمنع إعادة محاولة اختبار اتسلّم. إعادة المحاولة محتاجة دعم من الباك إند.',
    retake: 'أعد المحاولة',
    retaking: 'بنبدأ محاولة جديدة...',
    retakeErrorTitle: 'مش قادرين نبدأ محاولة جديدة.',
    retakeErrorBody: 'الاختبار ده متسلّم بالفعل في المحاكي.',
    notSubmittedTitle: 'المحاولة لسه مخلّصتش',
    notSubmittedBody: 'كمّل الاختبار الأول، وبعدها تراجع من هنا.',
  },
  /** Student lessons, derived from enrolled units. Student register: Egyptian. */
  lessons: {
    headTitle: `دروسي — ${B}`,
    badge: 'دروسي',
    title: 'دروسك خطوة خطوة',
    lead: 'دي وحدات صفوفك والدروس اللي جواها. ابدأ من الوحدة اللي محتاجة شغل.',
    loading: 'بنحمّل دروسك...',
    loadErrorTitle: 'مش قادرين نحمّل دروسك.',
    loadErrorBody: 'المشكلة من جهتنا مش من جهتك. جرّب تاني بعد شوية.',
    noSessionTitle: 'مفيش جلسة طالب.',
    noSessionBody: 'سجّل دخول الطالب لعرض دروسك.',
    classLabel: 'الصف',
    lessonsCount: (count: number) => countPhrase(count, lessonsEgy),
    completedLabel: 'دروس خلّصتها',
    progressLabel: 'تقدّمك',
    emptyTitle: 'مفيش دروس لسه',
    emptyBody: 'لما ينضم لصفّك منهج فيه دروس، هتظهر هنا.',
    barLabel: (name: string) => `تقدّمك في ${name}`,
  },
  /** Student own progress. Student register: Egyptian casual. */
  progress: {
    headTitle: `تقدّمي — ${B}`,
    badge: 'تقدّمي',
    title: 'شوف تقدّمك كامل',
    lead: 'تقدّمك في وحدات صفوفك، والوحدات اللي محتاجة شغل الأول.',
    loading: 'بنحمّل تقدّمك...',
    loadErrorTitle: 'مش قادرين نحمّل تقدّمك.',
    loadErrorBody: 'المشكلة من جهتنا مش من جهتك. جرّب تاني بعد شوية.',
    noSessionTitle: 'مفيش جلسة طالب.',
    noSessionBody: 'سجّل دخول الطالب لعرض تقدّمك.',
    overallLabel: 'التقدّم العام',
    unitsHeading: 'وحداتك',
    classLabel: 'الصف',
    lessonsCompleted: 'دروس خلّصتها',
    lastActive: 'آخر نشاط',
    noActivity: 'مفيش نشاط مسجّل',
    emptyTitle: 'مفيش تقدّم لعرضه لسه',
    emptyBody: 'لما تبدأ وحدات صفوفك، هيظهر تقدّمك هنا.',
    barLabel: (name: string) => `تقدّمك في ${name}`,
  },
  /** Teacher Assistant — display only what the backend granted. */
  assistant: {
    headTitle: `مساحة مساعد المعلم — ${B}`,
    badge: 'مساعد المعلم',
    title: 'الأقسام الممنوحة لحسابك',
    lead: 'دي الأقسام اللي الخادم منحها لحسابك. مفيش واجهة منح هنا، والواجهة بتعرض الممنوح بس.',
    loading: 'جارٍ تحميل الصلاحيات...',
    loadErrorTitle: 'تعذّر تحميل الصلاحيات.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    noSessionTitle: 'لا توجد جلسة مساعد معلم.',
    noSessionBody:
      'هذه شاشة معاينة داخلية. شغّل جلسة المساعد التجريبية لعرض الأقسام الممنوحة.',
    grantedHeading: 'الممنوح لك',
    grantedLead: 'الأقسام الممنوحة، بترتيب ثابت من الخادم.',
    grantedEmptyTitle: 'لا أقسام ممنوحة',
    grantedEmptyBody: 'لم يمنح الخادم أي قسم لحسابك بعد.',
    noteTitle: 'ملاحظة على الصلاحيات',
    note:
      'محتوى المعلم يحتاج جلسة معلم وفرض صلاحيات من الباك إند. هذه الشاشة تعرض الممنوح من الخادم فقط.',
    sessionHeading: 'الجلسة الحالية',
    sessionName: 'الاسم',
    sessionRole: 'الدور',
    capability: {
      dashboard: 'لوحة التحكم',
      classes: 'الصفوف',
      tests: 'الاختبارات',
      students: 'الطلاب',
    } as Record<'dashboard' | 'classes' | 'tests' | 'students', string>,
  },
  /** Sign-in — Mentingo-owned auth; honest, not an invented flow. */
  auth: {
    headTitle: `تسجيل الدخول — ${B}`,
    badge: 'تسجيل الدخول',
    title: 'تسجيل الدخول',
    lead: 'تسجيل الدخول والأدوار مسؤولية Mentingo، ولم تُوصَل بعد. هذه شاشة معاينة داخلية فقط.',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    submit: 'دخول',
    disabledNote:
      'الحقول معطّلة لأن المصادقة غير موصولة بعد، ولن نخترع نظام دخول.',
    noteTitle: 'ملاحظة',
    note: 'لا يوجد نظام مصادقة خاص بـ BRIDGIO. سيُحوّل الدخول إلى Mentingo عند توفّره.',
    demoHeading: 'الجلسات التجريبية',
    demoLead:
      'هذه النسخة تعمل بجلسة تجريبية تُحدَّد من متغيّر بيئة، لا بتسجيل دخول.',
    demoNote:
      'لتبديل الدور، شغّل النسخة بجلسة تجريبية أخرى ثم بدّل الدور من أسفل الشاشة.',
  },
  /** Profile / settings — session display + UI settings. */
  profile: {
    headTitle: `الملف الشخصي والإعدادات — ${B}`,
    badge: 'الملف الشخصي',
    title: 'الملف الشخصي والإعدادات',
    lead: 'بيانات الحساب مسؤولية Mentingo. تعرض هذه الشاشة الجلسة الحالية وإعدادات الواجهة.',
    loading: 'جارٍ تحميل الجلسة...',
    loadErrorTitle: 'تعذّر تحميل الجلسة.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    sessionHeading: 'الجلسة الحالية',
    sessionName: 'الاسم',
    sessionRole: 'الدور',
    sessionEmail: 'البريد الإلكتروني',
    noSession: 'لا توجد جلسة معروضة.',
    accountHeading: 'بيانات الحساب',
    accountNote:
      'تعديل الاسم أو البريد أو الأدوار مسؤولية Mentingo، ولم تُوصَل بعد. لا نعرض نموذجًا وهميًا.',
    accountSignIn: 'افتح صفحة تسجيل الدخول',
    settingsHeading: 'إعدادات الواجهة',
    languageLabel: 'اللغة',
    themeLabel: 'المظهر',
    themeLight: 'فاتح',
    themeDark: 'داكن',
    roles: {
      teacher: 'المعلم',
      student: 'الطالب',
      assistant: 'مساعد المعلم',
      parent: 'وليّ الأمر',
    } as Record<PreviewRoleId, string>,
  },
  /** Help / guide — pinned utility. */
  help: {
    headTitle: `المساعدة والدليل — ${B}`,
    badge: 'المساعدة',
    title: 'المساعدة والدليل',
    lead: `دليل سريع للشاشات المبنية في نسخة ${B} هذه، وحدودها.`,
    screensHeading: 'الشاشات المبنية',
    screensLead: 'افتح أي شاشة من الروابط التالية.',
    open: 'افتح',
    limitsHeading: 'حدود هذه النسخة',
    limits: [
      'لا تصحيح آلي ولا درجات في مشغّل الطالب.',
      'لا سعر ولا اشتراكات في الواجهة.',
      'تسجيل الدخول والأدوار مسؤولية Mentingo، ولم تُوصَل بعد.',
      'البيانات تجريبية وتأتي عبر طبقة البيانات، وليست بيانات حقيقية.',
      `صياغة العربية مسودات بانتظار المراجعة، و${B} و${M} اسمان عملان.`,
    ],
    sessionHeading: 'الجلسات التجريبية',
    sessionBody:
      'تُحدَّد الجلسة من متغيّر البيئة VITE_MOCK_SESSION، وبديل عنها مبدّل دور المعاينة من أسفل الشاشة.',
    links: {
      dashboard: 'لوحة المعلم',
      classes: 'صفوفي',
      students: 'الطلاب',
      tests: 'اختباراتي',
      lessons: 'دروسي',
      progress: 'تقدّمي',
      profile: 'الملف الشخصي والإعدادات',
      signIn: 'تسجيل الدخول',
    } as Record<
      | 'dashboard'
      | 'classes'
      | 'students'
      | 'tests'
      | 'lessons'
      | 'progress'
      | 'profile'
      | 'signIn',
      string
    >,
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
      'parent-progress': 'تقدّم الابن',
      'parent-tests': 'الاختبارات',
      'parent-results': 'النتائج',
      'parent-messages': 'الرسائل',
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
      'parent-progress': 'هذه النسخة — عرض وليّ الأمر (قراءة فقط).',
      'parent-tests': 'هذه النسخة — عرض وليّ الأمر (قراءة فقط).',
      'parent-results': 'هذه النسخة — عرض وليّ الأمر (قراءة فقط).',
      'parent-messages': 'هذه النسخة — عرض وليّ الأمر (قراءة فقط).',
    } as Record<ScreenId, string>,
  },
  root: {
    notFound: 'الصفحة غير موجودة.',
    notFoundBody: 'راجع التنقّل أعلاه، أو عد إلى زر الرجوع في المتصفح.',
    errorTitle: 'حدث خطأ غير متوقع.',
    errorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
  },
} as const

/**
 * Widen the literal types of `ar` so the English mirror can hold any string.
 * The shape (keys, function arity) is identical, so `en` fails to compile if a
 * key is missing or renamed.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends (...args: infer A) => infer R
          ? (...args: A) => Widen<R>
          : T extends object
            ? { [K in keyof T]: Widen<T[K]> }
            : T

export type Strings = Widen<typeof ar>

/**
 * DRAFT English — mirrors `ar` key for key. Not approved final copy; like the
 * Arabic, it lives here so a wording change is a one-line edit and the
 * BRIDGIO / Mohsen working names stay swappable from one place.
 */
export const en: Strings = {
  head: {
    title: `${B} — sidebar shell with full Arabic and English support`,
    description:
      `A shell refinement in ${B}: a sidebar for every role, a slim utility header, Thmanyah Arabic fonts, and a full Arabic/English toggle that flips the page to left-to-right. Built on logical properties and driven by demo data through the data layer. This is an internal build for verification, not a final product.`,
  },
  stageBanner: {
    stage: 'Shell refinement — separate branch',
    note: 'Sidebar, slim utility header, Thmanyah Arabic fonts and a language toggle. Demo data comes through the data layer; it is not real data.',
  },
  header: {
    navLabel: 'Primary navigation',
    lockupAlt: `${B} full lockup (character and name).`,
    wordmarkAlt: `${B} adopted wordmark.`,
    skipToMain: 'Skip to content',
    menuLabel: 'Open navigation menu',
    menuCloseLabel: 'Close menu',
    utilityLabel: 'Utility bar',
    langLabel: 'Language',
    langToEnglish: 'English',
    langToArabic: 'العربية',
    langGlyphEnglish: 'EN',
    langGlyphArabic: 'ع',
    assistantLabel: 'Messages',
    assistantOpenLabel: 'Open messages',
    accountLabel: 'Account',
    accountNote: 'Sign-in and roles are owned by Mentingo and are not connected yet.',
    themeLabel: 'Theme',
    themeToDark: 'Dark theme',
    themeToLight: 'Light theme',
  },
  preview: {
    groupAria: 'Preview role — UI state only, no sign-in.',
    label: 'Preview role:',
    roles: {
      teacher: 'Teacher',
      student: 'Student',
      assistant: 'Teacher Assistant',
      parent: 'Parents',
    },
  },
  sidebar: {
    navLabel: 'Primary navigation',
    openLabel: 'Open navigation menu',
    closeLabel: 'Close menu',
    collapseLabel: 'Collapse sidebar',
    expandLabel: 'Expand sidebar',
    assistantNote:
      'These items appear only when this account has been granted them by the backend. There is no granting UI in this build.',
    utilitiesLabel: 'Helpful links',
    helpLabel: 'Help and guide',
    profileLabel: 'Profile',
  },
  nav: {
    'teacher-dashboard': 'Dashboard',
    'teacher-classes': 'My Classes',
    'teacher-tests': 'Tests',
    'teacher-students': 'Students',
    'student-tests': 'My Tests',
    'student-lessons': 'Lessons',
    'student-progress': 'My Progress',
    'parent-progress': "Child's Progress",
    'parent-tests': 'Tests',
    'parent-results': 'Results',
    'parent-messages': 'Messages',
  },
  footer: {
    demoNote: 'The data shown here is demo data.',
    note: `${B} and ${M} are working names that can change, and the Arabic wording is a draft awaiting review.`,
    noteEn: `${B} — internal build for brand verification. Not final, nothing external-facing.`,
  },
  shell: {
    home: {
      badge: 'Shell and brand',
      title: 'App shell: colour, fonts, layout',
      lead: 'This is a guidance screen for the shell only. The teacher dashboard was built in Stage 2 and the student test player in Stage 4; the remaining student screens arrive in later stages.',
      builtHeading: 'What is built so far',
      built: [
        'The full design layer: brand colours, state colours and the proposed UI colours.',
        'A Thmanyah Arabic UI font (referenced by Thmanyah family name with a fallback to Alexandria, because the font files are not bundled in the public repository).',
        'Sora and Nunito for Latin text in the English UI.',
        'A fixed sidebar for the primary navigation of every role, shown as a drawer from the menu button on phones.',
        'A slim utility header: brand, language toggle, messages button and account area (no navigation links).',
        'A full Arabic/English toggle that flips the page direction between right-to-left and left-to-right.',
        'Teacher, student and parent navigation, plus Teacher Assistant navigation limited to the capabilities granted by the backend.',
        'The teacher dashboard: classes, recent tests and student progress through the data layer.',
        'The test builder: four steps from choosing a source to publishing, through the data layer.',
        `The student test player: question, options, progress and submission, with the ${M} question panel, through the data layer.`,
        'A read-only parent view: progress, tests, results and messages, through the data layer.',
      ],
      notBuiltHeading: 'What is not built yet',
      notBuiltLead:
        'The rest of the product screens arrive in later stages. The links below open empty guidance pages, not product screens.',
    },
    roleHint:
      'Switch the preview role (diagnostic only) from the footer, or directly in the page URL:',
    codeHint:
      '…?as=teacher, …?as=student, …?as=assistant or …?as=parent',
  },
  dashboard: {
    headTitle: `Teacher dashboard — ${B}`,
    badge: 'Teacher dashboard',
    title: 'Spend less time chasing updates',
    quickActions: {
      heading: 'Quick actions',
      createTest: 'Create a test',
      createTestBody: 'Open the test builder and start a new test.',
      viewTests: 'View tests',
      viewTestsBody: 'Review your tests from the tests screen.',
    },
    activity: {
      heading: 'Recent activity',
      lead: 'The tests you worked on most recently, newest first.',
      emptyTitle: 'No activity yet',
      emptyBody: 'Your latest test work will appear here.',
    },
    attention: {
      heading: 'Tests needing attention',
      lead: 'Unpublished drafts come first, so no test is left incomplete.',
      emptyTitle: 'Nothing pending',
      emptyBody: 'Every test is published and nothing needs your attention right now.',
    },
    lead: 'Your classes, recent tests and student progress on one screen, so you reach what needs attention without hopping between pages.',
    greeting: (name: string) => `Welcome, ${name}.`,
    totals: {
      label: 'Quick summary',
      classes: 'Classes',
      students: 'Students',
      publishedTests: 'Published tests',
      draftTests: 'Drafts',
    },
    classes: {
      heading: 'Classes',
      emptyTitle: 'No classes yet',
      emptyBody:
        'No classes are linked to your account yet. They will appear here as soon as they are added.',
      students: 'Students',
      units: 'Units',
      lessons: 'Lessons',
    },
    tests: {
      heading: 'Recent tests',
      emptyTitle: 'No tests yet',
      emptyBody:
        'No test has been created yet. The last five tests appear here once available.',
      questionsCount: (count: number) => englishCount(count, 'question', 'questions'),
      updated: 'Updated',
      unknownDate: 'Date unavailable',
      statusPublished: 'Published',
      statusDraft: 'Draft',
    },
    progress: {
      heading: 'Student progress',
      lead: 'Sorted from the least progress, so you start where a student needs it.',
      emptyTitle: 'No progress to show yet',
      emptyBody: 'When students join your classes, their progress appears here.',
      percentLabel: 'Progress',
      unitsCompleted: 'Units completed',
      lastActive: 'Last active',
      noActivity: 'No activity recorded',
      barLabel: (name: string) => `${name} progress`,
    },
    loading: 'Loading your dashboard...',
    loadErrorTitle: 'We could not load your dashboard.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    noSessionTitle: 'No teacher session.',
    noSessionBody:
      'Sign-in and roles are owned by Mentingo and are not connected yet. This is an internal preview screen only.',
    emptyAllTitle: 'Nothing here yet',
    emptyAllBody:
      'No classes and no tests yet. They will appear here as soon as they are added.',
  },
  builder: {
    headTitle: `Test builder — ${B}`,
    badge: 'Test builder',
    title: 'Create a test in four steps',
    lead: `Pick a material or a curriculum unit, let ${M} draft questions from the chosen source, review and edit them, then publish to your class. Every step saves you preparation time.`,
    stepsLabel: 'Test creation steps',
    stepDone: 'Completed',
    steps: {
      1: 'Choose source',
      2: `${M} drafts`,
      3: 'Review and edit',
      4: 'Publish',
    },
    loading: 'Loading the test builder...',
    loadErrorTitle: 'We could not load the test builder.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    noSessionTitle: 'No teacher session.',
    noSessionBody:
      'Sign-in and roles are owned by Mentingo and are not connected yet. This is an internal preview screen only.',
    source: {
      heading: 'Choose a material or curriculum unit',
      lead: `Pick a class first, then choose the question source. The source stays visible with every draft and every question ${M} drafts.`,
      classLabel: 'Class',
      classPlaceholder: 'Choose a class',
      classesEmptyTitle: 'No classes yet',
      classesEmptyBody:
        'No classes are linked to your account yet. They will appear here as soon as they are added.',
      classesError: 'We could not load the classes. Try again shortly.',
      kindLabel: 'Source type',
      kindMaterial: 'A material of mine',
      kindUnit: 'A curriculum unit',
      selectClassHint:
        'Choose a class first to see its available materials and curriculum units.',
      materialHeading: 'Available materials',
      materialReady: 'Ready to use',
      materialWords: (count: number) => englishCount(count, 'word', 'words'),
      unitLessons: (count: number) => englishCount(count, 'lesson', 'lessons'),
      materialsLoading: 'Loading materials...',
      materialsEmptyTitle: 'No materials for this class',
      materialsEmptyBody:
        'No material has been uploaded for this class yet. You can choose one of the class curriculum units instead.',
      materialsError: 'We could not load the materials. Try again shortly.',
      materialProcessing: 'Processing',
      unitHeading: 'Class curriculum units',
      unitsLoading: 'Loading curriculum units...',
      unitsEmptyTitle: 'No units for this class',
      unitsEmptyBody:
        'No curriculum units are linked to this class. Try another class or choose one of your materials.',
      unitsError: 'We could not load the curriculum units. Try again shortly.',
      titleLabel: 'Test title',
      titlePlaceholder: 'For example: Derivative rules review',
      titleHint: 'Students see this title after publishing.',
      descriptionLabel: 'Short description (optional)',
      descriptionPlaceholder: 'What does the test cover?',
      lockedNote:
        'The class and source cannot be changed after the draft starts. To start a different source, finish this draft or start a new test after publishing.',
      createDraft: 'Continue to question drafting',
      creatingDraft: 'Creating the draft...',
      createDraftErrorTitle: 'We could not create the draft.',
      createDraftErrorBody:
        'It is on our side, not yours. Check the fields and try again.',
    },
    draft: {
      heading: `${M} drafts the questions`,
      lead: `${M} drafts questions from the chosen source only: your material or the curriculum unit. The source appears with every question, and ${M} never drafts a question without a source.`,
      focusLabel: `Optional guidance for ${M}`,
      focusPlaceholder: 'For example: focus on the product rule',
      countLabel: 'Number of questions requested',
      countHint: `From 1 to 10. ${M} may return fewer if the source does not contain enough.`,
      sourceLabel: 'Source',
      request: `Ask ${M} to draft`,
      requestMore: 'Add more questions',
      retry: 'Try again',
      requesting: 'Drafting from the source...',
      idleTitle: 'No drafting requested yet',
      idleBody: `Press the draft button so ${M} reads the chosen source and proposes editable, deletable draft questions.`,
      draftedTitle: 'Question draft',
      draftedNote:
        'Every question here is an editable, deletable draft before publishing.',
      draftedSuccessTitle: `${M} drafted sourced questions`,
      draftedSuccessBody: `${M} added questions from the chosen source only, each with its source. Review them below before continuing.`,
      questionsCount: (count: number) =>
        `${englishCount(count, 'question', 'questions')} in the draft`,
      noGroundingTitle: 'No new questions from this source',
      noGroundingFallback: `${M} did not find enough in the chosen source to draft questions. They will not guess.`,
      draftErrorTitle: 'We could not draft the questions.',
      draftErrorBody: 'It is on our side, not yours. Try again shortly.',
      nextReview: 'Review the questions',
    },
    review: {
      heading: 'Review and edit the questions',
      lead: `Every question ${M} drafted is editable and deletable before publishing. No draft is published before you review it.`,
      loading: 'Loading the draft questions...',
      loadErrorTitle: 'We could not load the questions.',
      loadErrorBody: 'It is on our side, not yours. Try again shortly.',
      emptyTitle: 'No questions yet',
      emptyBody: `Go back to step two and ask ${M} to draft questions from the chosen source. Publishing needs at least one question.`,
      backToDraft: 'Back to question drafting',
      listHeading: 'Questions in the draft',
      questionNumber: (number: string) => `Question ${number}`,
      originMohsen: `Drafted by ${M}`,
      originTeacher: 'By the teacher',
      groundingLabel: 'Question source',
      correctLabel: 'Reference answer',
      correctNone: 'Not set',
      edit: 'Edit',
      delete: 'Delete',
      deleteConfirm: 'Delete question',
      deleteConfirmPrompt: 'Delete this question? This can\'t be undone.',
      deleteCancel: 'Keep question',
      save: 'Save changes',
      saving: 'Saving...',
      cancel: 'Cancel editing',
      promptLabel: 'Question text',
      optionsLabel: 'Options',
      optionLabel: (number: string) => `Option ${number}`,
      correctHint:
        'The reference answer is saved for the teacher only; there is no automatic marking yet.',
      addOption: 'Add an option',
      removeOption: (number: string) => `Remove option ${number}`,
      issuePrompt: 'Write the question text.',
      issueOptions:
        'Write between two and six options, with no empty option.',
      issueCorrect: 'Set a reference answer from the options.',
      updateErrorTitle: 'We could not save the change.',
      updateErrorBody: 'It is on our side, not yours. Try again.',
      deleteErrorTitle: 'We could not delete the question.',
      deleteErrorBody: 'It is on our side, not yours. Try again.',
      nextPublish: 'Continue to publishing',
    },
    publish: {
      heading: 'Publish to the class',
      lead: 'Review the summary, then publish the test to the chosen class. Publishing makes the test available to students.',
      summaryTitle: 'Test summary',
      titleLabel: 'Title',
      classLabel: 'Class',
      sourceLabel: 'Source',
      questionsLabel: 'Number of questions',
      statusLabel: 'Status',
      statusDraft: 'Draft',
      statusPublished: 'Published',
      groundingTitle: 'Question sources',
      publishButton: 'Publish the test',
      publishing: 'Publishing...',
      publishErrorTitle: 'We could not publish the test.',
      publishErrorBody: 'It is on our side, not yours. Try again shortly.',
      blocked: {
        no_test: 'There is no draft yet. Start from step one.',
        no_class:
          'The test cannot be published without a chosen class. Go back to step one and choose a class.',
        no_questions: `The test cannot be published without at least one question. Go back to step three and add a question or ask ${M} to draft.`,
        already_published: 'This test is already published.',
      },
      blockedTitle: 'Publishing is not available yet',
      successTitle: 'Test published',
      successBody: (title: string, className: string) =>
        `“${title}” was published to ${className}.`,
      successNote:
        'You can create a new test now. There is no automatic marking or scoring yet.',
      newTest: 'Create a new test',
      noGrounding: 'No source is shown.',
    },
    grounding: {
      label: 'Source',
      material: 'Material',
      unit: 'Curriculum unit',
    },
    nav: {
      back: 'Previous',
      next: 'Next',
    },
  },
  player: {
    headTitle: `My Tests — ${B}`,
    badge: 'Take tests',
    title: 'Start a test step by step',
    lead: `Pick a test, answer the questions and submit. Any time, you can ask ${M} beside you about anything from the test material.`,
    loading: 'Loading your tests...',
    loadErrorTitle: 'We could not load your tests.',
    loadErrorBody: 'The problem is on our side, not yours. Try again shortly.',
    noSessionTitle: 'No student session.',
    noSessionBody:
      'Sign-in and roles are owned by Mentingo and are not connected yet. This is an internal preview screen only.',
    list: {
      heading: 'Available tests',
      lead: 'These are the tests published to your classes. Tap a test to start or continue.',
      emptyTitle: 'No tests yet',
      emptyBody:
        'When your teacher publishes a test for your class, it appears here right away.',
      questions: (count: number) => englishCount(count, 'question', 'questions'),
      statusNew: 'New',
      statusInProgress: 'In progress',
      statusSubmitted: 'Submitted',
      start: 'Start the test',
      resume: 'Continue the test',
      submittedNote:
        'You already submitted this test. Nothing is marked yet.',
      starting: 'Starting the test...',
      startErrorTitle: 'We could not start the test.',
      startErrorBody: 'Try again shortly.',
    },
    runner: {
      loading: 'Loading the test...',
      loadErrorTitle: 'We could not open the test.',
      loadErrorBody: 'Try again shortly.',
      progressLabel: 'Your progress',
      questionCount: (current: string, total: string) =>
        `Question ${current} of ${total}`,
      optionsLabel: 'Choose one answer',
      previous: 'Previous',
      next: 'Next',
      saveErrorTitle: 'We could not save your answer.',
      saveErrorBody: 'Try choosing again.',
      submit: 'Submit the test',
      submitting: 'Submitting...',
      submitErrorTitle: 'We could not submit the test.',
      submitErrorBody: 'Try again shortly.',
      confirmTitle: 'Some questions are still unanswered',
      confirmBody: (remaining: number) =>
        remaining === 1
          ? '1 question is still unanswered. Do you want to submit anyway?'
          : `${englishCount(remaining, 'question', 'questions')} are still unanswered. Do you want to submit anyway?`,
      confirmSubmit: 'Yes, submit',
      confirmContinue: 'Keep answering',
      changeTest: 'Another test',
      doneTitle: 'Test submitted',
      doneBody: (title: string) => `We recorded your submission for “${title}”.`,
      doneNoMarking:
        'Your attempt is recorded. There is no automatic marking or scores yet.',
      doneNext: 'You can pick another test from the list.',
      backToList: 'Back to the tests list',
    },
    mohsen: {
      heading: `Ask ${M}`,
      lead: `${M} answers from the test material only, and if the answer is not found, says so instead of guessing.`,
      inputLabel: 'Your question',
      placeholder: 'Write your question here...',
      ask: 'Ask',
      asking: 'Asking...',
      emptyTitle: 'You have not asked anything yet',
      empty: `Ask ${M} about anything in this test.`,
      questionLabel: 'Your question',
      answeredLabel: `${M}'s answer`,
      refusalLabel: `${M} found no answer`,
      notGroundedFallback:
        'I have no documented answer from the test material for this question. I will not guess.',
      groundingLabel: 'Source',
      errorTitle: `${M} cannot answer right now.`,
      errorBody: 'Try again shortly.',
    },
  },
  parent: {
    headTitle: `Parents — ${B}`,
    badge: 'Parent',
    loading: 'Loading the child data...',
    loadErrorTitle: 'We could not load the data.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    noSessionTitle: 'No parent session.',
    noSessionBody:
      'Sign-in and roles are owned by Mentingo and are not connected yet. This is an internal preview screen only.',
    childLabel: 'Child',
    childPlaceholder: 'Choose a child',
    readOnlyNote:
      'This screen is display only and never computes a score.',
    progress: {
      heading: "Child's progress",
      lead: 'A quick look at your child\'s progress across curriculum units.',
      overall: 'Overall progress',
      completedUnits: 'Units completed',
      lastActive: 'Last active',
      noActivity: 'No activity recorded',
      unitsHeading: 'Units',
      lessonsCompleted: 'Lessons completed',
      emptyTitle: 'No progress to show yet',
      emptyBody:
        'Your child\'s progress will appear here as soon as it is available.',
      barLabel: (name: string) => `${name} progress`,
    },
    tests: {
      heading: "Child's tests",
      lead: 'The status of your child\'s tests.',
      statusNotStarted: 'Not started',
      statusInProgress: 'In progress',
      statusSubmitted: 'Submitted',
      answered: (answered: string, total: string) =>
        `Answered ${answered} of ${total}`,
      emptyTitle: 'No tests yet',
      emptyBody: 'Your child\'s tests will appear here once the teacher publishes them.',
    },
    results: {
      heading: 'Results',
      lead: 'Results as calculated by the platform. This screen never computes a score.',
      scoreLabel: 'Score',
      scoreUnavailable: 'Not scored yet',
      submittedAt: 'Submitted at',
      unanswered: 'Not submitted',
      answeredCount: (answered: string, total: string) =>
        `Answered ${answered} of ${total}`,
      emptyTitle: 'No results yet',
      emptyBody:
        'Your child\'s results will appear here once marking is complete.',
    },
    messages: {
      heading: 'Messages',
      lead: 'Mock in-app conversations with the teacher and the teacher assistant. No notifications and no real-time.',
      open: 'Open messages',
    },
  },
  chat: {
    title: 'Messages',
    openLabel: 'Open messages',
    closeLabel: 'Close messages',
    threadsLabel: 'Conversations',
    noThreads: 'No conversations yet.',
    selectThread: 'Choose a conversation to see its messages.',
    loading: 'Loading conversations...',
    loadError: 'We could not load the conversations. Try again shortly.',
    messagesLoading: 'Loading messages...',
    messagesError: 'We could not load the messages. Try again shortly.',
    empty: 'No messages yet. Write the first one.',
    inputLabel: 'Your message',
    placeholder: 'Write your message here...',
    send: 'Send',
    sending: 'Sending...',
    sendError: 'We could not send the message. Try again.',
    youLabel: 'You',
    replyFrom: (name: string) => `Reply from ${name}`,
    mockNote:
      'Mock in-app chat only — no notifications, no real-time transport and no external channel.',
    roleNames: {
      parent: 'Parent',
      teacher: 'Teacher',
      assistant: 'Teacher Assistant',
    },
  },
  classes: {
    headTitle: `My Classes — ${B}`,
    badge: 'My Classes',
    title: 'Your classes and their units',
    lead: 'See each class with its students, units and lessons, and open a class for its detail.',
    loading: 'Loading your classes...',
    loadErrorTitle: 'We could not load your classes.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    emptyTitle: 'No classes yet',
    emptyBody:
      'No classes are linked to your account yet. They will appear here as soon as they are added.',
    students: 'Students',
    units: 'Units',
    lessons: 'Lessons',
    open: 'Open class',
    detail: {
      back: 'All classes',
      loading: 'Loading the class...',
      loadErrorTitle: 'We could not load this class.',
      loadErrorBody: 'It is on our side, not yours. Try again shortly.',
      notFoundTitle: 'Class not found.',
      notFoundBody: 'The class may have been removed, or the link is incorrect.',
      unitsHeading: 'Units',
      unitsLead: 'The curriculum units linked to this class, with material and test counts.',
      unitsEmptyTitle: 'No units for this class',
      unitsEmptyBody: 'No curriculum units are linked to this class yet.',
      materialCount: (count: number) => englishCount(count, 'material', 'materials'),
      testCount: (count: number) => englishCount(count, 'test', 'tests'),
      lessonsCount: (count: number) => englishCount(count, 'lesson', 'lessons'),
      rosterHeading: 'Class students',
      rosterLead: 'The student list with each student\'s progress in the class.',
      rosterEmptyTitle: 'No students yet',
      rosterEmptyBody: 'When students join the class, they appear here.',
      rosterError: 'We could not load the student list.',
      testsHeading: 'Class tests',
      testsLead: 'This class\'s tests, newest first.',
      testsEmptyTitle: 'No tests for this class',
      testsEmptyBody: 'No test has been created for this class yet.',
    },
  },
  students: {
    headTitle: `Students — ${B}`,
    badge: 'Students',
    title: 'Your students and their progress',
    lead: 'Every student of your classes in one place, with progress and last activity.',
    loading: 'Loading the students...',
    loadErrorTitle: 'We could not load the students.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    emptyTitle: 'No students yet',
    emptyBody: 'When students join your classes, they appear here.',
    open: 'Open student',
    classLabel: 'Class',
    progressLabel: 'Progress',
    lastActive: 'Last active',
    noActivity: 'No activity recorded',
    detail: {
      back: 'All students',
      loading: 'Loading the student data...',
      loadErrorTitle: 'We could not load the student data.',
      loadErrorBody: 'It is on our side, not yours. Try again shortly.',
      notFoundTitle: 'Student not found.',
      notFoundBody: 'The student may have been removed, or the link is incorrect.',
      overallLabel: 'Overall progress',
      classLabel: 'Class',
      unitsHeading: 'Units',
      unitsLead: 'The student\'s progress across the class units.',
      lessonsCompleted: 'Lessons completed',
      lastActive: 'Last active',
      noActivity: 'No activity recorded',
      emptyTitle: 'No progress to show yet',
      emptyBody: 'The student\'s progress will appear here as soon as it is available.',
      barLabel: (name: string) => `${name} progress`,
    },
  },
  testDetail: {
    headTitle: `Test detail — ${B}`,
    badge: 'Test detail',
    loading: 'Loading the test...',
    loadErrorTitle: 'We could not load the test.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    notFoundTitle: 'Test not found.',
    notFoundBody: 'The test may have been removed, or the link is incorrect.',
    back: 'All tests',
    metaClass: 'Class',
    metaSource: 'Source',
    metaQuestions: 'Number of questions',
    metaUpdated: 'Updated',
    metaPublished: 'Published at',
    statusPublished: 'Published',
    statusDraft: 'Draft',
    unknownDate: 'Date unavailable',
    readOnlyTitle: 'This test is published',
    readOnlyBody:
      'Published tests are read-only in this build. The share target and the questions cannot be edited after publishing.',
    editHeading: 'Edit test details',
    editLead: 'The title and description can be edited while the test is a draft.',
    titleLabel: 'Test title',
    descriptionLabel: 'Short description (optional)',
    descriptionPlaceholder: 'What does the test cover?',
    save: 'Save changes',
    saving: 'Saving...',
    saved: 'Changes saved.',
    saveErrorTitle: 'We could not save the change.',
    saveErrorBody: 'It is on our side, not yours. Try again.',
    questionsHeading: 'Test questions',
    questionsLead: 'Every question in order, each with its source.',
    questionsEmptyTitle: 'No questions yet',
    questionsEmptyBody: 'Add questions from the test builder before publishing.',
    publishHeading: 'Publishing',
    publishLead: 'Publish the test to the class after reviewing the questions.',
    publish: 'Publish the test',
    publishing: 'Publishing...',
    publishErrorTitle: 'We could not publish the test.',
    publishErrorBody: 'It is on our side, not yours. Try again shortly.',
    publishBlockedNoQuestions:
      'The test cannot be published without at least one question.',
    publishSuccessTitle: 'Test published',
    publishSuccessBody: (className: string) => `The test was published to ${className}.`,
    resultsHeading: 'Test results',
    resultsUnavailableTitle: 'Per-test results are not available yet',
    resultsUnavailableBody:
      'The current contract does not expose per-test results. To review student progress, open the class page.',
    resultsClassLink: 'Open the class page',
  },
  results: {
    headTitle: `Test review — ${B}`,
    badge: 'Test review',
    title: 'Review your answers',
    lead: 'See what you answered on the test. There is no automatic marking or scores yet.',
    loading: 'Loading your review...',
    loadErrorTitle: 'We could not load your review.',
    loadErrorBody: 'The problem is on our side, not yours. Try again shortly.',
    notFoundTitle: 'No attempt on this test.',
    notFoundBody: 'Start the test first from your tests list.',
    back: 'Back to my tests',
    statusLabel: 'Status',
    statusSubmitted: 'Submitted',
    statusInProgress: 'In progress',
    submittedAtLabel: 'Submitted at',
    noSubmit: 'Not submitted yet',
    answeredLabel: 'Questions answered',
    answeredValue: (answered: string, total: string) => `${answered} of ${total}`,
    scoreLabel: 'Score',
    scoreNote:
      'Scores are backend-supplied and are not connected yet. This screen never computes a score.',
    reviewHeading: 'Question review',
    reviewLead: 'This is your choice on each question. We do not say right or wrong.',
    questionLabel: (number: string) => `Question ${number}`,
    yourAnswer: 'Your answer',
    noAnswer: 'No answer',
    retakeHeading: 'Retake',
    retakeBody:
      'The current mock rejects a retake of a submitted test. Retaking needs backend support.',
    retake: 'Retake the test',
    retaking: 'Starting a new attempt...',
    retakeErrorTitle: 'We could not start a new attempt.',
    retakeErrorBody: 'This test is already submitted in the mock.',
    notSubmittedTitle: 'The attempt is not finished',
    notSubmittedBody: 'Finish the test first, then review your answers from here.',
  },
  lessons: {
    headTitle: `Lessons — ${B}`,
    badge: 'Lessons',
    title: 'Your lessons, step by step',
    lead: 'These are your class units and the lessons inside them. Start with the unit that needs work.',
    loading: 'Loading your lessons...',
    loadErrorTitle: 'We could not load your lessons.',
    loadErrorBody: 'The problem is on our side, not yours. Try again shortly.',
    noSessionTitle: 'No student session.',
    noSessionBody: 'Sign in as a student to see your lessons.',
    classLabel: 'Class',
    lessonsCount: (count: number) => englishCount(count, 'lesson', 'lessons'),
    completedLabel: 'Lessons completed',
    progressLabel: 'Your progress',
    emptyTitle: 'No lessons yet',
    emptyBody: 'When a curriculum with lessons joins your class, they appear here.',
    barLabel: (name: string) => `Your progress in ${name}`,
  },
  progress: {
    headTitle: `My Progress — ${B}`,
    badge: 'My Progress',
    title: 'See your full progress',
    lead: 'Your progress across your class units, with the units that need work first.',
    loading: 'Loading your progress...',
    loadErrorTitle: 'We could not load your progress.',
    loadErrorBody: 'The problem is on our side, not yours. Try again shortly.',
    noSessionTitle: 'No student session.',
    noSessionBody: 'Sign in as a student to see your progress.',
    overallLabel: 'Overall progress',
    unitsHeading: 'Your units',
    classLabel: 'Class',
    lessonsCompleted: 'Lessons completed',
    lastActive: 'Last active',
    noActivity: 'No activity recorded',
    emptyTitle: 'No progress to show yet',
    emptyBody: 'Once you start your class units, your progress appears here.',
    barLabel: (name: string) => `Your progress in ${name}`,
  },
  assistant: {
    headTitle: `Teacher Assistant area — ${B}`,
    badge: 'Teacher Assistant',
    title: 'The sections granted to your account',
    lead: 'These are the sections the backend granted your account. There is no granting UI here; the UI shows only what is granted.',
    loading: 'Loading the capabilities...',
    loadErrorTitle: 'We could not load the capabilities.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    noSessionTitle: 'No teacher assistant session.',
    noSessionBody:
      'This is an internal preview screen. Run the assistant demo session to see the granted sections.',
    grantedHeading: 'Granted to you',
    grantedLead: 'The granted sections, in the backend\'s fixed order.',
    grantedEmptyTitle: 'No granted sections',
    grantedEmptyBody: 'The backend has not granted any section to your account yet.',
    noteTitle: 'A note on permissions',
    note:
      'Teacher content needs a teacher session and backend RBAC enforcement. This screen shows only what the backend granted.',
    sessionHeading: 'Current session',
    sessionName: 'Name',
    sessionRole: 'Role',
    capability: {
      dashboard: 'Dashboard',
      classes: 'Classes',
      tests: 'Tests',
      students: 'Students',
    },
  },
  auth: {
    headTitle: `Sign in — ${B}`,
    badge: 'Sign in',
    title: 'Sign in',
    lead: 'Sign-in and roles are owned by Mentingo and are not connected yet. This is an internal preview screen only.',
    emailLabel: 'Email',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    submit: 'Sign in',
    disabledNote:
      'The fields are disabled because authentication is not connected yet, and we will not invent a sign-in flow.',
    noteTitle: 'A note',
    note: 'There is no BRIDGIO auth system. Sign-in will delegate to Mentingo when available.',
    demoHeading: 'Demo sessions',
    demoLead:
      'This build runs on a demo session set by an environment variable, not by signing in.',
    demoNote:
      'To switch the role, run the build with another demo session, then switch the preview role from the footer.',
  },
  profile: {
    headTitle: `Profile and settings — ${B}`,
    badge: 'Profile',
    title: 'Profile and settings',
    lead: 'Account data is owned by Mentingo. This screen shows the current session and the UI settings.',
    loading: 'Loading the session...',
    loadErrorTitle: 'We could not load the session.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    sessionHeading: 'Current session',
    sessionName: 'Name',
    sessionRole: 'Role',
    sessionEmail: 'Email',
    noSession: 'No session is shown.',
    accountHeading: 'Account data',
    accountNote:
      'Editing the name, email or roles is owned by Mentingo and is not connected yet. No fake form is shown here.',
    accountSignIn: 'Open the sign-in page',
    settingsHeading: 'UI settings',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    roles: {
      teacher: 'Teacher',
      student: 'Student',
      assistant: 'Teacher Assistant',
      parent: 'Parents',
    },
  },
  help: {
    headTitle: `Help and guide — ${B}`,
    badge: 'Help',
    title: 'Help and guide',
    lead: `A quick guide to the screens built in this ${B} build, and their limits.`,
    screensHeading: 'Built screens',
    screensLead: 'Open any screen from the links below.',
    open: 'Open',
    limitsHeading: 'Limits of this build',
    limits: [
      'No automatic marking and no scores in the student player.',
      'No price and no subscriptions in the UI.',
      'Sign-in and roles are owned by Mentingo and are not connected yet.',
      'The data is demo data that comes through the data layer; it is not real data.',
      `The Arabic wording is a draft awaiting review, and ${B} and ${M} are working names.`,
    ],
    sessionHeading: 'Demo sessions',
    sessionBody:
      'The session is set by the VITE_MOCK_SESSION environment variable; the preview-role switch in the footer is an alternative.',
    links: {
      dashboard: 'Teacher dashboard',
      classes: 'My Classes',
      students: 'Students',
      tests: 'My Tests',
      lessons: 'Lessons',
      progress: 'My Progress',
      profile: 'Profile and settings',
      signIn: 'Sign in',
    },
  },
  placeholder: {
    badge: 'Screen not built yet',
    notBuiltYetTeacher:
      'A guidance page only, not a product screen. Per the stage plan, this screen is built in a later stage.',
    notBuiltYetStudent:
      'This is not a product screen, just a guidance page. The screen itself arrives step by step in later stages.',
    builtBy: 'Built in:',
    homeScreenName: 'App shell and brand',
    screens: {
      'shell-home': 'App shell and brand',
      'teacher-dashboard': 'Teacher dashboard',
      'teacher-classes': 'My Classes',
      'teacher-tests': 'Tests',
      'teacher-students': 'Students',
      'student-tests': 'My Tests',
      'student-lessons': 'Lessons',
      'student-progress': 'My Progress',
      'parent-progress': "Child's Progress",
      'parent-tests': 'Tests',
      'parent-results': 'Results',
      'parent-messages': 'Messages',
    },
    builtByScreen: {
      'shell-home': 'This stage (1) — as the shell placeholder only.',
      'teacher-dashboard': 'Stage 2 — the teacher dashboard.',
      'teacher-classes': 'Stage 2 — classes currently appear on the dashboard only.',
      'teacher-tests': 'Stage 3 — the test builder.',
      'teacher-students':
        'Stage 2 — student progress currently appears on the dashboard only.',
      'student-tests': 'Stage 4 — the test player.',
      'student-lessons': 'Not set in the stage plan yet — no promises.',
      'student-progress': 'Not set in the stage plan yet — no promises.',
      'parent-progress': 'This build — parent view (read only).',
      'parent-tests': 'This build — parent view (read only).',
      'parent-results': 'This build — parent view (read only).',
      'parent-messages': 'This build — parent view (read only).',
    },
  },
  root: {
    notFound: 'Page not found.',
    notFoundBody: 'Check the navigation, or use the browser back button.',
    errorTitle: 'Something unexpected happened.',
    errorBody: 'It is on our side, not yours. Try again shortly.',
  },
}
