import type { GroundingRef } from '~/api/types'
import { useStrings } from '~/shell/useStrings'

/**
 * Grounding shown with every Mohsen-drafted question (and every reviewed
 * question that still carries a source). The adapter supplies the label and
 * excerpt; the UI never invents a source.
 */
export function GroundingList({
  grounding,
  label,
}: {
  grounding: readonly GroundingRef[]
  label?: string
}) {
  const strings = useStrings()
  if (grounding.length === 0) return null

  return (
    <div className="grounding">
      <p className="grounding__title">{label ?? strings.builder.grounding.label}</p>
      <ul className="grounding__list">
        {grounding.map((ref, index) => (
          <li
            className="grounding__item"
            key={`${ref.kind}:${ref.materialId ?? ref.unitId}:${index}`}
          >
            <span className="grounding__kind">
              {ref.kind === 'material'
                ? strings.builder.grounding.material
                : strings.builder.grounding.unit}
            </span>
            <span className="grounding__label">{ref.label}</span>
            {ref.excerpt ? (
              <q className="grounding__excerpt">{ref.excerpt}</q>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
