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

/**
 * Swap points for the two working names. Every Arabic string that mentions a
 * name interpolates these two consts, so a rename is a one-line change here
 * (brand.name / assistant.nameAr) plus the matching artwork file name.
 */
const B = brand.name
const M = assistant.nameAr

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
    title: `${B} — المرحلة ٦: تلميع الاتساق`,
    description:
      `لمسة تلميع أخيرة في ${B}: توحيد الأزرار والحقول والوسوم وأنماط التقدّم عبر لوحة المعلم ومنشئ الاختبارات ومشغّل اختبار الطالب، وتركيز كل النصوص في مكان واحد. بتخطيط عربي كامل من اليمين إلى اليسار، وبالبيانات التجريبية عبر طبقة البيانات. هذه نسخة داخلية للتحقق وليست نسخة منتج نهائية.`,
  },
  stageBanner: {
    stage: 'المرحلة ٦ من ٧',
    note: 'لمسة تلميع أخيرة على الاتساق في الشاشات الثلاث. البيانات تجريبية وتأتي عبر طبقة البيانات، وليست بيانات حقيقية.',
  },
  header: {
    navLabel: 'التنقّل الرئيس',
    lockupAlt: `شعار ${B} الكامل (الشخصية والاسم معًا).`,
    wordmarkAlt: `اسم ${B} النصي المعتمد.`,
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
        'الخطوط الأربعة المعتمدة: Sora وNunito للاتينية، Alexandria وBaloo Bhaijaan 2 للعربية.',
        'تخطيط عربي كامل من اليمين إلى اليسار بسمة ضوئية فقط.',
        'شريط هوية بالشعار الكامل على الشاشات الكبيرة، وبالاسم النصي المعتمد (120 بكسل فأكثر) على الشريط الصغير.',
        'تنقّل المعلم وتنقّل الطالب مع مفتاح معاينة الدور.',
        'لوحة المعلم: الصفوف وآخر الاختبارات وتقدّم الطلاب عبر طبقة البيانات.',
        'منشئ الاختبارات: أربع خطوات من اختيار المصدر إلى النشر، عبر طبقة البيانات.',
        `مشغّل اختبار الطالب: السؤال والخيارات والتقدّم والتسليم، مع لوحة أسئلة ${M}، عبر طبقة البيانات.`,
      ],
      notBuiltHeading: 'ما لم يُبنَ بعد',
      notBuiltLead:
        'باقي شاشات المنتج تُبنى في المراحل التالية. الروابط أدناه تفتح صفحات إرشادية فارغة، وليست شاشات منتج.',
    },
    roleHint: 'بدّل دور المعاينة من أعلى الشاشة (بخانة "دور المعاينة")، أو مباشرة من عنوان الصفحة:',
    codeHint: '…?as=teacher أو …?as=student',
  },
  dashboard: {
    headTitle: `لوحة المعلم — ${B}`,
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
  builder: {
    headTitle: `منشئ الاختبارات — ${B}`,
    badge: 'منشئ الاختبارات',
    title: 'أنشئ اختبارًا في أربع خطوات',
    lead:
      `اختر المادة أو وحدة المنهج، ودع ${M} يصوغ الأسئلة من المصدر المحدد، ثم راجعها وعدّلها، وانشرها إلى صفك. كل خطوة تحفظ وقت إعداد الاختبار.`,
    stepsLabel: 'خطوات إنشاء الاختبار',
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
        'لا توجد صفوف مرتبطة بحسابك في هذه النسخة. تظهر هنا تلقائيًا عند توفرها عبر طبقة البيانات.',
      classesError: 'تعذّر تحميل الصفوف. أعد المحاولة بعد قليل.',
      kindLabel: 'نوع المصدر',
      kindMaterial: 'مادة من موادّي',
      kindUnit: 'وحدة من المنهج',
      selectClassHint: 'اختر صفًا أولًا لعرض المواد ووحدات المنهج المتاحة له.',
      materialHeading: 'المواد المتاحة',
      materialReady: 'جاهزة للاستخدام',
      materialWords: (count: string) => `${count} كلمة`,
      unitLessons: (count: string) => `${count} دروس`,
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
        'لا توجد وحدات منهج مرتبطة بهذا الصف في هذه النسخة. جرّب صفًا آخر أو اختر مادة من موادّك.',
      unitsError: 'تعذّر تحميل وحدات المنهج. أعد المحاولة بعد قليل.',
      titleLabel: 'عنوان الاختبار',
      titlePlaceholder: 'مثال: مراجعة قواعد الاشتقاق',
      titleHint: 'يظهر هذا العنوان للطلاب بعد النشر.',
      descriptionLabel: 'وصف مختصر (اختياري)',
      descriptionPlaceholder: 'ما الذي يغطيه الاختبار؟',
      lockedNote:
        'لا يمكن تغيير الصف أو المصدر بعد بدء المسودة في هذه النسخة. لبدء مصدر مختلف، أنهِ هذه المسودة أو ابدأ اختبارًا جديدًا بعد النشر.',
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
      questionsCount: (count: string) => `${count} سؤالًا في المسودة`,
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
      deleteConfirm: 'تأكيد الحذف',
      deleteCancel: 'إلغاء',
      save: 'حفظ التعديل',
      saving: 'جارٍ الحفظ…',
      cancel: 'إلغاء التعديل',
      promptLabel: 'نص السؤال',
      optionsLabel: 'الخيارات',
      optionLabel: (number: string) => `الخيار ${number}`,
      correctHint:
        'تُحفظ الإجابة المرجعية للمعلم فقط؛ لا يوجد تصحيح آلي في هذه المرحلة.',
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
        'يمكنك إنشاء اختبار جديد الآن. لا يوجد تصحيح آلي أو احتساب درجات في هذه المرحلة.',
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
      questions: (count: string) => `${count} أسئلة`,
      statusNew: 'جديد',
      statusInProgress: 'شغّال',
      statusSubmitted: 'تم التسليم',
      start: 'ابدأ الاختبار',
      resume: 'كمّل الاختبار',
      submittedNote: 'سلّمت الاختبار ده خلاص. التصحيح مش جزء من المرحلة دي.',
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
      confirmBody: (remaining: string) =>
        `فاضل ${remaining} أسئلة من غير إجابة. تحب تسلّم برضه؟`,
      confirmSubmit: 'أيوه، سلّم',
      confirmContinue: 'كمّل حل',
      changeTest: 'اختبار تاني',
      doneTitle: 'تم تسليم الاختبار',
      doneBody: (title: string) => `سجّلنا تسليمك لاختبار «${title}».`,
      doneNoMarking:
        'المرحلة دي بتسجّل المحاولة بس، من غير تصحيح آلي ولا درجات.',
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
      empty: `لسه ما سألتش حاجة. اسأل ${M} على أي حاجة في الاختبار ده.`,
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
      'Stage 6 polish: consistent buttons, inputs, tags/chips and progress patterns across the dashboard, builder and player, with all strings centralised and the BRIDGIO / Mohsen working names swappable from one place. No new features, no marking, no price. Not final.',
  },
} as const
