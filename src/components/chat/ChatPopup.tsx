import { useEffect } from 'react'
import { AppIcon } from '~/components/AppIcon'
import { ChatSurface } from '~/components/chat/ChatSurface'
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

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

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
