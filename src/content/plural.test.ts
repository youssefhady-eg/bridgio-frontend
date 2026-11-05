import { describe, expect, it } from 'vitest'
import { countPhrase, englishCount, type NounForms } from './plural'
import { ar, en } from './strings'

const questions: NounForms = {
  one: 'سؤال واحد',
  two: 'سؤالان',
  few: 'أسئلة',
  many: 'سؤالًا',
}

describe('countPhrase — Arabic number–noun agreement', () => {
  it('uses the singular phrase for one and the dual for two', () => {
    expect(countPhrase(1, questions)).toBe('سؤال واحد')
    expect(countPhrase(2, questions)).toBe('سؤالان')
  })

  it('uses digit + plural for 0 and 3–10', () => {
    expect(countPhrase(0, questions)).toBe('٠ أسئلة')
    expect(countPhrase(3, questions)).toBe('٣ أسئلة')
    expect(countPhrase(10, questions)).toBe('١٠ أسئلة')
  })

  it('uses digit + singular for 11 and above', () => {
    expect(countPhrase(11, questions)).toBe('١١ سؤالًا')
    expect(countPhrase(25, questions)).toBe('٢٥ سؤالًا')
  })

  it('never throws or prints NaN for a bad count', () => {
    expect(countPhrase(Number.NaN, questions)).toBe('٠ أسئلة')
    expect(countPhrase(-4, questions)).toBe('٠ أسئلة')
    expect(countPhrase(2.4, questions)).toBe('سؤالان')
  })
})

describe('englishCount', () => {
  it('singularises only for exactly one', () => {
    expect(englishCount(1, 'question', 'questions')).toBe('1 question')
    expect(englishCount(0, 'question', 'questions')).toBe('0 questions')
    expect(englishCount(2, 'question', 'questions')).toBe('2 questions')
    expect(englishCount(Number.NaN, 'question', 'questions')).toBe('0 questions')
  })
})

describe('UI copy that counts things', () => {
  it('teacher copy uses formal agreement', () => {
    expect(ar.dashboard.tests.questionsCount(1)).toBe('سؤال واحد')
    expect(ar.dashboard.tests.questionsCount(2)).toBe('سؤالان')
    expect(ar.dashboard.tests.questionsCount(3)).toBe('٣ أسئلة')
    expect(ar.builder.draft.questionsCount(3)).toBe('٣ أسئلة في المسودة')
    expect(ar.builder.draft.questionsCount(1)).toBe('سؤال واحد في المسودة')
    expect(ar.builder.source.materialWords(43)).toBe('٤٣ كلمة')
    expect(ar.builder.source.unitLessons(4)).toBe('٤ دروس')
    expect(ar.builder.source.unitLessons(2)).toBe('درسان')
  })

  it('student copy uses Egyptian casual agreement', () => {
    expect(ar.player.list.questions(2)).toBe('سؤالين')
    expect(ar.player.list.questions(3)).toBe('٣ أسئلة')
    expect(ar.player.runner.confirmBody(2)).toBe(
      'فاضل سؤالين من غير إجابة. تحب تسلّم برضه؟',
    )
    expect(ar.player.runner.confirmBody(1)).toContain('سؤال واحد')
    expect(ar.player.runner.confirmBody(5)).toContain('٥ أسئلة')
  })

  it('English copy agrees in number', () => {
    expect(en.dashboard.tests.questionsCount(1)).toBe('1 question')
    expect(en.player.list.questions(3)).toBe('3 questions')
    expect(en.builder.draft.questionsCount(1)).toBe('1 question in the draft')
    expect(en.player.runner.confirmBody(1)).toBe(
      '1 question is still unanswered. Do you want to submit anyway?',
    )
    expect(en.builder.source.unitLessons(1)).toBe('1 lesson')
  })

  it('no counted Arabic copy keeps the old fixed plural after a digit', () => {
    for (const text of [
      ar.dashboard.tests.questionsCount(1),
      ar.dashboard.tests.questionsCount(2),
      ar.builder.draft.questionsCount(3),
      ar.player.list.questions(1),
      ar.player.list.questions(2),
      ar.player.runner.confirmBody(1),
      ar.player.runner.confirmBody(2),
    ]) {
      expect(text).not.toMatch(/[١٢] أسئلة/)
      expect(text).not.toMatch(/٣ سؤالًا/)
    }
  })
})
