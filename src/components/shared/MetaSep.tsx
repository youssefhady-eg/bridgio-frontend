/**
 * Middle-dot separator rendered as its own element.
 *
 * A literal " · " inside a text run is a space character either side of the dot;
 * in RTL those spaces can collapse at the text-node boundary and the glyph ends
 * up touching its neighbours. As an element the dot gets explicit horizontal
 * margins from a spacing token instead. It is decorative, so it is hidden from
 * assistive technology.
 */
export function MetaSep() {
  return (
    <span className="meta-sep" aria-hidden="true">
      ·
    </span>
  )
}