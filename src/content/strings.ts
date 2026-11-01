/**
 * CENTRALISED UI STRINGS — Stage 0 only.
 *
 * Arabic wording here is DRAFT, awaiting owner / Arabic reviewer approval.
 * It is deliberately kept in one file so it can be replaced without touching
 * components. Brand and assistant names are working names and live here so a
 * rename is a swap, not a rebuild.
 *
 * The wordmark is artwork and is never retyped in a font; `wordmarkText` below is
 * for documentation only and must not be rendered as the logo.
 */

export const brand = {
  /** Running-text name. */
  name: 'Bridgio',
  /** Logo lettering is artwork; this string is only for docs/alt text later. */
  wordmarkText: 'BRIDGIO',
} as const

export const assistant = {
  name: 'Mohsen',
  nameAr: 'محسن',
} as const

/** DRAFT Arabic — not approved final copy. */
export const ar = {
  stage0: {
    badge: 'المرحلة صفر · عقد مقترح',
    title: 'الهيكل الأساسي وعقد واجهة البيانات',
    lead: 'تطبيق TanStack جاهز للتشغيل، وطبقة بيانات واحدة مع محاكي محلي. لا توجد شاشات منتج في هذه المرحلة.',
    adapterHeading: 'حالة طبقة البيانات',
    loading: 'جارٍ التحقق من الطبقة…',
    error: 'تعذّر قراءة حالة الطبقة. هذه ليست شاشة منتج.',
    mode: 'الوضع',
    mock: 'محاكي محلي',
    http: 'HTTP — غير موصول',
    contractVersion: 'نسخة العقد',
    scenario: 'بيانات المحاكي',
    seeded: 'بيانات تجريبية',
    empty: 'فارغة',
    endpointStatus: 'حالة نقاط النهاية',
    proposed: 'مقترحة فقط — لم تُعتمد من Mentingo',
    notBuiltHeading: 'ما لم يُبنَ في هذه المرحلة',
    notBuilt: [
      'لا شاشات منتج: لوحة المعلم ومنشئ الاختبارات ومشغّل الطالب تأتي في المراحل التالية.',
      'لا اتصال حي بـ Mentingo، وكل نقاط النهاية في العقد مقترحة فقط.',
      'لا مصادقة أو مستخدمين أو أدوار خاصة بـ Bridgio؛ المصادقة مملوكة لـ Mentingo.',
    ],
    noConnection: 'لا يوجد اتصال حي بـ Mentingo في هذه المرحلة.',
    docsHint: 'التفاصيل في docs/API-ADAPTER-CONTRACT.md و docs/STAGE-0-DELIVERY-NOTE.md.',
  },
  root: {
    notFound: 'الصفحة غير موجودة.',
    errorTitle: 'حدث خطأ غير متوقع.',
    errorBody:
      'هذه ليست شاشة منتج. راجع سجل التشغيل أو أعد تشغيل الخادم المحلي.',
  },
} as const

export const en = {
  stage0: {
    footer:
      'Stage 0 scaffold + typed API adapter contract. All endpoints PROPOSED only. No product screens, no Mentingo connection.',
  },
} as const
