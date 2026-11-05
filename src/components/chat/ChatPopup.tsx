import { useRef } from 'react'
import { AppIcon } from '~/components/AppIcon'
import { ChatSurface } from '~/components/chat/ChatSurface'
import { useFocusScope } from '~/shell/useFocusScope'
import { useStrings } from '~/shell/useStrings'

/**
 * In-app chat popup — refinement branch.
 *
 * A modal shell around the shared ChatSurface, in the pattern of the planned AI
 * Chat / AI Assistant popup. Mock only: no real-time transport, no
 * notifications, and no external channel. Closes on Escape, backdrop click or
 * the close button.
 */

interface ChatPopupProps {
  open: boolean
  onClose: () => void
}

export function ChatPopup({ open, onClose }: ChatPopupProps) {
  const strings = useStrings()

  // Focus moves into the dialog, stays inside it, Escape closes it, and focus
  // returns to the button that opened it.
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusScope(open, panelRef, onClose)

  if (!open) return null

  return (
    <div className="chat-popup">
      <button
        type="button"
        className="chat-popup__backdrop"
        aria-label={strings.chat.closeLabel}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="chat-popup__panel"
        role="dialog"
        aria-modal="true"
        aria-label={strings.chat.title}
      >
        <header className="chat-popup__head">
          <h2 className="chat-popup__title">{strings.chat.title}</h2>
          <button
            type="button"
            className="chat-popup__close"
            onClick={onClose}
            aria-label={strings.chat.closeLabel}
          >
            <AppIcon name="close" size={20} />
          </button>
        </header>
        <ChatSurface active={open} />
      </div>
    </div>
  )
}
