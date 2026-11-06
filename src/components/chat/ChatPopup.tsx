import { Dialog, Modal, ModalOverlay } from 'react-aria-components'
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

  // React Aria supplies the modal behaviour: focus moves in and is contained,
  // Escape and backdrop press close it, focus returns to the opener, and the
  // page behind is inert for assistive tech. Styling stays on our tokens.
  return (
    <ModalOverlay
      className="chat-popup"
      isOpen={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      isDismissable
    >
      <Modal className="chat-popup__panel">
        <Dialog className="chat-popup__dialog" aria-label={strings.chat.title}>
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
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
