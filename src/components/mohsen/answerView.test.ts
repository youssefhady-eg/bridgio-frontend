import { describe, expect, it } from 'vitest'
import type { MohsenAnswer } from '~/api/types'
import { answerView, usableGrounding } from './answerView'

const ref = {
  kind: 'material' as const,
  materialId: 'mat_1',
  unitId: 'unit_1',
  label: 'مذكرة التفاضل',
  excerpt: 'مشتقة الدالة xⁿ هي n·xⁿ⁻¹.',
}

describe('answerView — grounded answers only', () => {
  it('keeps an answered result that carries usable grounding', () => {
    const answer: MohsenAnswer = {
      status: 'answered',
      answer: 'نص الإجابة',
      grounding: [ref],
    }
    const view = answerView(answer)
    expect(view.status).toBe('answered')
    if (view.status !== 'answered') return
    expect(view.grounding).toHaveLength(1)
    expect(view.answer).toBe('نص الإجابة')
  })

  it('downgrades an answered result with no grounding to an honest refusal', () => {
    const answer: MohsenAnswer = {
      status: 'answered',
      answer: 'نص بلا مصدر',
      grounding: [],
    }
    const view = answerView(answer)
    expect(view.status).toBe('not_grounded')
    expect(view.grounding).toEqual([])
    expect(view.answer.length).toBeGreaterThan(0)
  })

  it('downgrades when every grounding ref lacks a quotable excerpt', () => {
    const answer: MohsenAnswer = {
      status: 'answered',
      answer: 'نص',
      grounding: [{ ...ref, excerpt: null }],
    }
    expect(answerView(answer).status).toBe('not_grounded')
  })

  it('drops unusable refs but keeps the answer when one ref is usable', () => {
    const answer: MohsenAnswer = {
      status: 'answered',
      answer: 'نص',
      grounding: [{ ...ref, label: '   ' }, ref],
    }
    const view = answerView(answer)
    expect(view.status).toBe('answered')
    if (view.status !== 'answered') return
    expect(view.grounding).toHaveLength(1)
    expect(usableGrounding(answer.grounding)).toHaveLength(1)
  })

  it('passes a not_grounded result through unchanged', () => {
    const answer: MohsenAnswer = {
      status: 'not_grounded',
      answer: 'محسن مش لاقي إجابة.',
      grounding: [],
    }
    expect(answerView(answer)).toEqual(answer)
  })
})
